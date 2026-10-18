# MKW-Table-Bot-Overlay

Overlay for displaying useful MKW Table Bot Info

## Usage

1. Open the setup page (`index.html`), enter your Friend Code and Table ID, and pick a theme.
2. Click **Open Overlay** and copy the resulting `overlay.html?...` URL into an OBS browser source.

The API URL field is stored in the browser's localStorage, not in the overlay link. OBS browser
sources have their own storage, so to use a custom API URL in OBS, open the setup page inside the
browser source (right-click → Interact) and save it there.

The overlay polls the API every 10 seconds, backing off up to 60 seconds while the API is failing.

## Themes

Each theme lives in `themes/<name>/`:

| File         | Required | Purpose                                                   |
| ------------ | -------- | --------------------------------------------------------- |
| `theme.html` | no       | Markup injected into `#overlay` before the theme loads    |
| `theme.css`  | no       | Stylesheet                                                |
| `theme.js`   | yes      | ES module exporting `update(data)` and optionally `init(root)` |

Add the folder name to `themes/themes.js` to make it selectable.

`init(root)` is called once with the `#overlay` element after `theme.html` is injected.
`update(data)` is called whenever the data changes, with:

| Field         | Type            | Notes                                                        |
| ------------- | --------------- | ------------------------------------------------------------ |
| `apiError`    | boolean         | Last request failed; other fields hold the last good values  |
| `playerFound` | boolean \| null | `false` if the FC isn't on the table; `null` before any data  |
| `format`      | string \| null  | e.g. `"FFA"`, `"2v2"`                                        |
| `tag`         | string \| null  | Team tag; `null` in FFA                                      |
| `races`       | number \| null  | Races played                                                 |
| `score`       | number \| null  | Player's score                                               |
| `teamScore`   | number \| null  | Team's score; `null` in FFA                                  |
| `rank`        | number \| null  | 1-based; tied teams share the highest rank                   |
| `tied`        | boolean \| null |                                                              |
| `position`    | string \| null  | e.g. `"Tied 3rd"`                                            |
| `ptsAhead`    | number \| null  | Points ahead of the next team below; `null` if last          |
| `ptsBehind`   | number \| null  | Points behind the next team above; `null` if first           |

## Gallery

![Default](/docs/assets/default.png)
