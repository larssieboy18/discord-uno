let hello = {
  event: {
    "version": 1,
    "user": {
      "username": "aCoolguy63",
      "public_flags": 0,
      "id": "793188304764928023",
      "discriminator": "8503",
      "avatar_decoration": null,
      "avatar": "068c83a0ed3de3c445cc69bb5b1c6a5b"
    },
    "type": 3,
    "token": "aW50ZXJhY3Rpb246MTAyMjU3NjMwNzcwOTY3NzcxMDpUNDFLbnk4ODJqN3ZkS2xpRWdjeld5WG1ocjdpMEJrUFZXRlQ5eEt2N0J1eFdsSG4xVldGUDhRb1J4UXNRcjlKajNFSDZ4N0xxYnZTYU8xbUZwSVc0MWE3a2JZOVVKb1hHUlh1NmtDd2xMR1hkMm1QcW41cHdiekF5RjBGZlZNeA",
    "message": {
      "type": 0,
      "tts": false,
      "timestamp": "2022-09-22T18:33:03.071000+00:00",
      "pinned": false,
      "mentions": [],
      "mention_roles": [],
      "mention_everyone": false,
      "id": "1022576277359693965",
      "flags": 0,
      "embeds": [
        {
          "type": "rich",
          "title": "UNO",
          "fields": [
            {
              "value": "<@119473151913623552>",
              "name": "Invited by",
              "inline": true
            },
            {
              "value": "<t:1663871577:f>",
              "name": "Invited at",
              "inline": true
            },
            {
              "value": "**UNO BLUE & GREEN + CONFIG** (*ID*: `975789410186567730`)",
              "name": "Server",
              "inline": true
            },
            {
              "value": "[Click here](https://discordapp.com/channels/975789410186567730/976400262677803018/1022576261450702918)",
              "name": "Invite message",
              "inline": true
            },
            {
              "value": "❌",
              "name": "Accepted by you?",
              "inline": true
            }
          ],
          "description": "Hello <@793188304764928023>! You have been invited to play UNO.\nDo you accept?",
          "color": 3092790
        }
      ],
      "edited_timestamp": null,
      "content": "",
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 3,
              "label": "Accept",
              "emoji": {
                "name": "acheck",
                "id": "984488658658807818",
                "animated": true
              },
              "custom_id": "accept-uno-invite"
            },
            {
              "type": 2,
              "style": 4,
              "label": "Deny",
              "emoji": {
                "name": "across",
                "id": "984488679173140520",
                "animated": true
              },
              "custom_id": "deny-uno-invite"
            }
          ]
        }
      ],
      "channel_id": "984497481821847602",
      "author": {
        "username": "UNO test bot",
        "public_flags": 0,
        "id": "976400332299063366",
        "discriminator": "0545",
        "bot": true,
        "avatar_decoration": null,
        "avatar": null
      },
      "attachments": []
    },
    "locale": "en-GB",
    "id": "1022576307709677710",
    "data": {
      "custom_id": "deny-uno-invite",
      "component_type": 2
    },
    "channel_id": "984497481821847602",
    "application_id": "976400332299063366",
    "received_at": "2022-09-22T18:33:10.391Z"
  }
}

// // get event info
// let { event } = context.params

// TODO Remove test data from `all.js`
// label: development
// lines: 1,117
// assignees: larssieboy18
// milestone: 1.0.0
// Remove all test data, i.e. the one listed in the first 112 lines of this file, from `all.js`.
// e.g. replace `hello` with `event` and remove the `hello` variable.
// replace `eventt` with `event` and remove the `eventt` variable.

// // get message info
// let { message } = hello

let eventt = hello.event

if (eventt.data.custom_id.includes(`accept-uno-invite`)) {
  return console.log(`accept-uno-invite button pressed. Separate function will handle this.`)
}

