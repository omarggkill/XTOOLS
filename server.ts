import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const makeDiscordClient = (token: string) => axios.create({
    baseURL: "https://discord.com/api/v10",
    headers: {
      "Authorization": token,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  const safeRequest = async (
    discord: ReturnType<typeof makeDiscordClient>,
    method: 'get' | 'post' | 'patch' | 'delete',
    url: string,
    data?: any,
    retries = 5
  ): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        if (method === 'get') return await discord.get(url);
        if (method === 'post') return await discord.post(url, data);
        if (method === 'patch') return await discord.patch(url, data);
        if (method === 'delete') return await discord.delete(url);
      } catch (e: any) {
        if (e.response?.status === 429) {
          const retryAfter = (e.response.data?.retry_after || 2) * 1000;
          await sleep(retryAfter + 500);
          continue;
        }
        if (i === retries - 1) throw e;
        await sleep(1500);
      }
    }
  };

  // Discord API Proxy - User Info
  app.get("/api/discord/me", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Token required" });
    try {
      const discord = makeDiscordClient(token as string);
      const response = await safeRequest(discord, 'get', '/users/@me');
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: "Failed to fetch user" });
    }
  });

  // Discord API Proxy - User Guilds
  app.get("/api/discord/guilds", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Token required" });
    try {
      const discord = makeDiscordClient(token as string);
      const response = await safeRequest(discord, 'get', '/users/@me/guilds');
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: "Failed to fetch guilds" });
    }
  });

  // Discord API Proxy - Clone Server (Full Clone)
  app.post("/api/discord/clone", async (req, res) => {
    const { userToken, sourceId, targetId } = req.body;
    if (!userToken || !sourceId || !targetId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
      const discord = makeDiscordClient(userToken);

      // 1. Fetch Source Data
      const [guildRes, rolesRes, channelsRes, emojisRes] = await Promise.all([
        safeRequest(discord, 'get', `/guilds/${sourceId}`),
        safeRequest(discord, 'get', `/guilds/${sourceId}/roles`),
        safeRequest(discord, 'get', `/guilds/${sourceId}/channels`),
        safeRequest(discord, 'get', `/guilds/${sourceId}/emojis`),
      ]);

      const sourceGuild = guildRes.data;
      const roles: any[] = rolesRes.data;
      const channels: any[] = channelsRes.data;
      const emojis: any[] = emojisRes.data;

      // 2. Fetch Target Data
      const [targetRolesRes, targetChannelsRes, targetEmojisRes] = await Promise.all([
        safeRequest(discord, 'get', `/guilds/${targetId}/roles`),
        safeRequest(discord, 'get', `/guilds/${targetId}/channels`),
        safeRequest(discord, 'get', `/guilds/${targetId}/emojis`),
      ]);

      const targetRoles: any[] = targetRolesRes.data;
      const targetChannels: any[] = targetChannelsRes.data;
      const targetEmojis: any[] = targetEmojisRes.data;

      // 3. Create temp channel to keep server alive
      let tempChannelId: string | null = null;
      try {
        const tempChan = await safeRequest(discord, 'post', `/guilds/${targetId}/channels`, {
          name: "cloning-in-progress",
          type: 0
        });
        tempChannelId = tempChan.data.id;
        await sleep(1000);
      } catch (e) {}

      // 4. Delete existing channels (except temp)
      for (const chan of targetChannels) {
        if (chan.id === tempChannelId) continue;
        try {
          await safeRequest(discord, 'delete', `/channels/${chan.id}`);
          await sleep(800);
        } catch (e) {}
      }

      // 5. Delete existing roles (except @everyone and managed)
      for (const role of targetRoles) {
        if (role.name === "@everyone" || role.managed) continue;
        try {
          await safeRequest(discord, 'delete', `/guilds/${targetId}/roles/${role.id}`);
          await sleep(800);
        } catch (e) {}
      }

      // 6. Delete existing emojis
      for (const emoji of targetEmojis) {
        try {
          await safeRequest(discord, 'delete', `/guilds/${targetId}/emojis/${emoji.id}`);
          await sleep(800);
        } catch (e) {}
      }

      // 7. Clone Guild Settings & Icon
      try {
        const guildUpdate: any = {
          verification_level: sourceGuild.verification_level,
          default_message_notifications: sourceGuild.default_message_notifications,
          explicit_content_filter: sourceGuild.explicit_content_filter,
          afk_timeout: sourceGuild.afk_timeout,
        };
        if (sourceGuild.icon) {
          const iconUrl = `https://cdn.discordapp.com/icons/${sourceId}/${sourceGuild.icon}.png`;
          const iconRes = await axios.get(iconUrl, { responseType: 'arraybuffer' });
          guildUpdate.icon = `data:image/png;base64,${Buffer.from(iconRes.data, 'binary').toString('base64')}`;
        }
        await safeRequest(discord, 'patch', `/guilds/${targetId}`, guildUpdate);
        await sleep(1000);
      } catch (e) {}

      // 8. Create Roles (sorted by position to preserve hierarchy)
      const roleMap: Record<string, string> = {};
      const sortedRoles = [...roles].sort((a, b) => a.position - b.position);
      const createdRoles: { id: string, position: number }[] = [];

      for (const role of sortedRoles) {
        if (role.name === "@everyone") {
          roleMap[role.id] = targetId;
          try {
            await safeRequest(discord, 'patch', `/guilds/${targetId}/roles/${targetId}`, {
              permissions: role.permissions
            });
          } catch (e) {}
          continue;
        }
        if (role.managed) continue;

        try {
          const newRole = await safeRequest(discord, 'post', `/guilds/${targetId}/roles`, {
            name: role.name,
            permissions: role.permissions,
            color: role.color,
            hoist: role.hoist,
            mentionable: role.mentionable
          });
          roleMap[role.id] = newRole.data.id;
          createdRoles.push({ id: newRole.data.id, position: role.position });
          await sleep(800);
        } catch (e) {}
      }

      // 9. Reorder Roles to match source hierarchy
      if (createdRoles.length > 0) {
        try {
          const reorderPayload = createdRoles
            .sort((a, b) => a.position - b.position)
            .map((r, index) => ({ id: r.id, position: index + 1 }));
          await safeRequest(discord, 'patch', `/guilds/${targetId}/roles`, reorderPayload);
          await sleep(1000);
        } catch (e) {}
      }

      // 10. Create Categories first (sorted by position)
      const channelMap: Record<string, string> = {};
      const categories = channels
        .filter((c: any) => c.type === 4)
        .sort((a: any, b: any) => a.position - b.position);

      for (const cat of categories) {
        try {
          const newCat = await safeRequest(discord, 'post', `/guilds/${targetId}/channels`, {
            name: cat.name,
            type: 4,
            position: cat.position,
            permission_overwrites: cat.permission_overwrites?.map((ov: any) => ({
              id: roleMap[ov.id] || ov.id,
              type: ov.type,
              allow: ov.allow,
              deny: ov.deny
            }))
          });
          channelMap[cat.id] = newCat.data.id;
          await sleep(800);
        } catch (e) {}
      }

      // 11. Create Sub-channels (sorted by position within categories)
      const subChannels = channels
        .filter((c: any) => c.type !== 4)
        .sort((a: any, b: any) => {
          // Sort by category first, then position
          const catCompare = (a.parent_id || '').localeCompare(b.parent_id || '');
          return catCompare !== 0 ? catCompare : a.position - b.position;
        });

      const createdChannels: { id: string, position: number, parent_id?: string }[] = [];

      for (const chan of subChannels) {
        try {
          const newChan = await safeRequest(discord, 'post', `/guilds/${targetId}/channels`, {
            name: chan.name,
            type: chan.type,
            position: chan.position,
            parent_id: chan.parent_id ? channelMap[chan.parent_id] : null,
            topic: chan.topic || null,
            nsfw: chan.nsfw || false,
            rate_limit_per_user: chan.rate_limit_per_user || 0,
            user_limit: chan.user_limit || 0,
            bitrate: chan.bitrate || 64000,
            permission_overwrites: chan.permission_overwrites?.map((ov: any) => ({
              id: roleMap[ov.id] || ov.id,
              type: ov.type,
              allow: ov.allow,
              deny: ov.deny
            }))
          });
          createdChannels.push({ id: newChan.data.id, position: chan.position, parent_id: newChan.data.parent_id });
          await sleep(800);
        } catch (e) {}
      }

      // 12. Reorder all channels to match source
      try {
        const reorderPayload: any[] = [];
        Object.entries(channelMap).forEach(([oldId, newId]) => {
          const original = channels.find((c: any) => c.id === oldId);
          if (original) reorderPayload.push({ id: newId, position: original.position });
        });
        createdChannels.forEach(chan => {
          reorderPayload.push({ id: chan.id, position: chan.position });
        });
        if (reorderPayload.length > 0) {
          await safeRequest(discord, 'patch', `/guilds/${targetId}/channels`, reorderPayload);
          await sleep(1000);
        }
      } catch (e) {}

      // 13. Clone Emojis
      for (const emoji of emojis) {
        try {
          const extension = emoji.animated ? 'gif' : 'png';
          const emojiUrl = `https://cdn.discordapp.com/emojis/${emoji.id}.${extension}`;
          const emojiRes = await axios.get(emojiUrl, { responseType: 'arraybuffer' });
          const base64Emoji = Buffer.from(emojiRes.data, 'binary').toString('base64');
          await safeRequest(discord, 'post', `/guilds/${targetId}/emojis`, {
            name: emoji.name,
            image: `data:image/${extension};base64,${base64Emoji}`,
            roles: emoji.roles?.map((rid: string) => roleMap[rid]).filter(Boolean)
          });
          await sleep(1200);
        } catch (e) {}
      }

      // 14. Cleanup temp channel
      if (tempChannelId) {
        try { await safeRequest(discord, 'delete', `/channels/${tempChannelId}`); } catch (e) {}
      }

      // 15. Final Verification
      const [vRoles, vChans, vEmojis] = await Promise.all([
        safeRequest(discord, 'get', `/guilds/${targetId}/roles`),
        safeRequest(discord, 'get', `/guilds/${targetId}/channels`),
        safeRequest(discord, 'get', `/guilds/${targetId}/emojis`),
      ]);

      res.json({
        success: true,
        message: "Cloning completed successfully",
        verification: {
          roles: { source: roles.length, target: vRoles.data.length },
          channels: { source: channels.length, target: vChans.data.length },
          emojis: { source: emojis.length, target: vEmojis.data.length }
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: "Cloning failed", details: error.response?.data });
    }
  });

  // Discord API Proxy - Clone Emojis Only (with deletion)
  app.post("/api/discord/clone-emojis", async (req, res) => {
    const { userToken, sourceId, targetId } = req.body;
    if (!userToken || !sourceId || !targetId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    try {
      const discord = makeDiscordClient(userToken);
      const [sourceEmojisRes, targetEmojisRes] = await Promise.all([
        safeRequest(discord, 'get', `/guilds/${sourceId}/emojis`),
        safeRequest(discord, 'get', `/guilds/${targetId}/emojis`),
      ]);
      const sourceEmojis = sourceEmojisRes.data;
      const targetEmojis = targetEmojisRes.data;

      for (const emoji of targetEmojis) {
        try { await safeRequest(discord, 'delete', `/guilds/${targetId}/emojis/${emoji.id}`); await sleep(800); } catch (e) {}
      }

      let clonedCount = 0;
      for (const emoji of sourceEmojis) {
        try {
          const extension = emoji.animated ? 'gif' : 'png';
          const emojiUrl = `https://cdn.discordapp.com/emojis/${emoji.id}.${extension}`;
          const emojiRes = await axios.get(emojiUrl, { responseType: 'arraybuffer' });
          await safeRequest(discord, 'post', `/guilds/${targetId}/emojis`, {
            name: emoji.name,
            image: `data:image/${extension};base64,${Buffer.from(emojiRes.data, 'binary').toString('base64')}`
          });
          clonedCount++;
          await sleep(1200);
        } catch (e) {}
      }
      res.json({ success: true, message: `Cloned ${clonedCount} emojis`, count: clonedCount });
    } catch (error: any) {
      res.status(500).json({ error: "Emoji cloning failed" });
    }
  });

  // Discord API Proxy - Add Emojis (No Deletion)
  app.post("/api/discord/add-emojis", async (req, res) => {
    const { userToken, sourceId, targetId } = req.body;
    if (!userToken || !sourceId || !targetId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    try {
      const discord = makeDiscordClient(userToken);
      const sourceEmojisRes = await safeRequest(discord, 'get', `/guilds/${sourceId}/emojis`);
      const sourceEmojis = sourceEmojisRes.data;

      let clonedCount = 0;
      for (const emoji of sourceEmojis) {
        try {
          const extension = emoji.animated ? 'gif' : 'png';
          const emojiUrl = `https://cdn.discordapp.com/emojis/${emoji.id}.${extension}`;
          const emojiRes = await axios.get(emojiUrl, { responseType: 'arraybuffer' });
          await safeRequest(discord, 'post', `/guilds/${targetId}/emojis`, {
            name: emoji.name,
            image: `data:image/${extension};base64,${Buffer.from(emojiRes.data, 'binary').toString('base64')}`
          });
          clonedCount++;
          await sleep(1200);
        } catch (e) {}
      }
      res.json({ success: true, message: `Added ${clonedCount} emojis`, count: clonedCount });
    } catch (error: any) {
      res.status(500).json({ error: "Emoji adding failed" });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (_req, res) => res.sendFile("dist/index.html", { root: "." }));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
