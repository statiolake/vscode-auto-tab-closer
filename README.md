# Auto Tab Closer

Automatically manage your VS Code tabs with intelligent closing and organization. Keep your workspace clean and focused by automatically closing excess tabs while protecting the ones you care about.

## Features

✨ **Smart Tab Management**
- Automatically closes excess tabs when you exceed a maximum limit
- Protects dirty (unsaved) tabs from being closed
- Preserves pinned tabs (never closes them)

🎯 **Customizable Protection**
- Keep a configurable number of tabs on the left side protected
- Perfect for keeping your most-used files accessible

⚡ **Debounced Closing**
- Configurable delay before closing tabs
- Prevents aggressive closing on rapid tab switches
- Smooth, non-intrusive behavior

## How It Works

1. You open tabs in VS Code as usual
2. When the number of open tabs exceeds `numMaxTabs`, the oldest tabs are automatically closed
3. Tabs within the first `numLeftTabs` positions are protected from automatic closing
4. Dirty (unsaved) tabs are always protected
5. The closing action is debounced by `delayMs` to avoid aggressive behavior

## Extension Settings

This extension contributes the following settings:

- `auto-tab-closer.numLeftTabs` (default: `3`)
  - Number of tabs to keep protected at the left side

- `auto-tab-closer.numMaxTabs` (default: `10`)
  - Maximum number of normal (non-pinned) tabs to keep open
  - When exceeded, the oldest tabs are automatically closed

- `auto-tab-closer.delayMs` (default: `1000`)
  - Delay in milliseconds before closing excess tabs after a tab change
  - Prevents rapid tab closures when switching between files

## Example Configuration

Add to your `.vscode/settings.json`:

```json
{
  "auto-tab-closer.numLeftTabs": 5,
  "auto-tab-closer.numMaxTabs": 15,
  "auto-tab-closer.delayMs": 500
}
```

## Requirements

- VS Code 1.105.0 or later

## Known Issues

None at this time. Please [report any issues](https://github.com/statiolake/vscode-auto-tab-closer/issues) you encounter!

## Release Notes

### 0.0.1

Initial release of Auto Tab Closer with core features:
- Automatic excess tab closing
- Configurable protection zones
- Debounced tab closing for smooth operation

## License

MIT
