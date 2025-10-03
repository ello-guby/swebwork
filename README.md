swebwork
========

> [!WARNING]
> this project was made a while ago.
> i forgot everything.

a pretty simple web framework


directories and files
---------------------

```
./              : root
├─ routes.json  : routes map
└─ swebwork/... : swebwork's files
```

routes.json
-----------

creating routes is pretty simple, consider the following:
```json
{
    "@": "./root/entry.mjs",
    "account": {
        "@": "./account/entry.mjs",
        "create": {
            "@": "./account/create/entry.mjs"
        },
        "setting": {
            "@": "./account/setting/entry.mjs",
        }
    },
    "@dead" : "./dead/entry.mjs"
}
```
- *account*, *create* and *setting* keys are the url routes map.
- any keys starting `@` is a special key.
- `@` keys are special keys called "route root" that hold a directory string to a file to get required when requested.
- `@dead` keys are special route for when requested url doesn't exist.

TODO
====

- i forgot where i left this.
