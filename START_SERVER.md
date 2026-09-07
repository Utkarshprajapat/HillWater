# How to Start the Development Server

## Quick Start

1. **Open a terminal** in the project directory:
   ```bash
   cd /Users/utsavsingh/Documents/waterhack
   ```

2. **Start the dev server**:
   ```bash
   npm run dev
   ```

3. **Wait for the output**. You should see something like:
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

4. **Open your browser** and go to:
   - http://localhost:5173
   - OR http://127.0.0.1:5173

## If You See Errors

### Error: "command not found: npm"
- Install Node.js from https://nodejs.org/
- Make sure Node.js 18+ is installed

### Error: "Cannot find module"
- Run: `npm install`
- This installs all dependencies

### Error: "Port already in use"
- The server will automatically try a different port
- Check the terminal output for the actual port number

### Error: "Permission denied"
- Try a different port by editing `vite.config.js`
- Or run: `sudo npm run dev` (not recommended)

## Troubleshooting

If the server starts but you still see "Connection Refused":

1. **Check the terminal output** - look for the actual URL/port
2. **Wait 5-10 seconds** after starting for the server to fully initialize
3. **Try both URLs**:
   - http://localhost:5173
   - http://127.0.0.1:5173
4. **Check your firewall** - make sure it's not blocking localhost
5. **Restart the server** - Press `Ctrl+C` to stop, then run `npm run dev` again

## Expected Behavior

Once the server is running:
- You'll see the Vite startup message in the terminal
- The dashboard should load in your browser
- The terminal will show any compilation errors if they occur

## Keep the Terminal Open

**Important:** Keep the terminal window open while using the app. Closing it will stop the server.

To stop the server, press `Ctrl+C` in the terminal.
