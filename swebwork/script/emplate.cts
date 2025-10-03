const { cpSync, existsSync } = require("node:fs");

const { Color, err } = require("#swebwork/cli.mts");

const filePath = process.argv[2];

if (!filePath) err(`${Color.OK}usage:${Color.INFO} npm run emplate ${Color.WARN}<file_path>\n${Color.OK}info: ${Color.NOTE}copy swebwork's template file to ${Color.WARN}<file_path>`);

if (existsSync(filePath)) err(`${Color.ERR}"${filePath}" is obstructed.`, 1);

const ext = filePath.substring(filePath.search(/[a-z0-9]+$/i)).toLowerCase().trim();

cpSync(`./swebwork/share/template/template.${ext}`, filePath);
