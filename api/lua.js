// api/execute-lua.js
const { lua, to_luastring, pcall } = require('fengari');

// Function to execute Lua code
function executeLua(code) {
  const L = lua.luaL_newstate();
  lua.luaL_openlibs(L);

  // Load and execute the Lua code
  const loaded = lua.luaL_loadstring(L, to_luastring(code));
  if (loaded !== lua.LUA_OK) {
    return `Error loading Lua code: ${lua.lua_tojsstring(L, -1)}`;
  }

  const result = pcall(L, 0, 1, 0);
  if (result === 0) {
    return `Error executing Lua code: ${lua.lua_tojsstring(L, -1)}`;
  }

  return lua.lua_tojsstring(L, -1);
}

// API endpoint
module.exports = async (req, res) => {
  const { query } = req;
  const luaCode = query.code;

  if (!luaCode) {
    return res.status(400).json({ error: "No Lua code provided" });
  }

  const result = executeLua(luaCode);

  return res.status(200).json({ result });
};
