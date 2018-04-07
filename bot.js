const Discord = require("discord.io");
const auth = require("./auth.json");
const COLORS = {
    Reset: "\x1b[0m",
    FBlack: "\x1b[30m",
    FRed: "\x1b[31m",
    FGreen: "\x1b[32m",
    FYellow: "\x1b[33m",
    FBlue: "\x1b[34m",
    FMagenta: "\x1b[35m",
    FCyan: "\x1b[36m",
    FWhite: "\x1b[37m",
    BBlack: "\x1b[40m",
    BRed: "\x1b[41m",
    BGreen: "\x1b[42m",
    BYellow: "\x1b[43m",
    BBlue: "\x1b[44m",
    BMagenta: "\x1b[45m",
    BCyan: "\x1b[46m",
    BWhite: "\x1b[47m"
};

const responses = [
    // Yes
    "Well... yeah. It's kinda obvious.",
    "Sure, I guess.",
    "uhm... duh??",
    "How could I ever say no to you? :heart:",
    "Ye.",
    "Very, very likely",
    "I'm betting my life on it",
    "Yup yup",

    // Maybe
    "Maybe. Perhaps. I guess.",
    "Yes. Well, yes *and* no.",
    "No. Well, yes *and* no.",,
    "Just... I mean, if you want to?",
    "I suppose. It's not the first thing that comes to my mind though",
    "I *GUESS*",
    "I don't know, maybe?",
    "It's not *impossible*, it's just not likely.",

    // No
    "NO! NEVER!",
    "Uhm... I don't think so",
    "Yeah, no, definitely not.",
    "Not. A. Chance.",
    "No.",
    "GOD NO",
    "I am certain that is not the case, no.",
    "Oh, no no no no no. Just no.",

    // Unspecified
    "Ehh...",
    "I'm kinda busy here, can't you figure it out yourself?",
    "I don't think I wanna give my opinion on this.",
    "LEAVE ME ALONE REEEEEEE",
    "It Depends™",
    "On times like this, I like to ask myself: what would Jesus say?",
    "Great question. Just wonderful. I love it. Ask me again.",
    "Huh. Never thought of it that way. I'll sleep on it and get back to you tomorrow, 'k?",
];

let reconnects = 0;
let last_user = "";

let bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on("ready", function(evt) {
    reconnects = 0;
    color([{
        bg: ["", 0],
        fg: ["", 0],
        msg: " Logged in as\n"
    },{
        bg: ["BWhite", 0],
        fg: ["FBlack", 0],
        msg: " " + bot.username + "#" + evt.d.user.discriminator + "\n\n"
    }]);
});

bot.on("disconnect", function(errMsg, code) {
    console.log("Woops! Bot seems to have crashed\n"
        + (errMsg ? "Error message: " + errMsg + "\n" : "")
        + (code ? "Error code: " + code + "\n" : "")
        + "\n----------");
    if(++reconnects < 5) {
        console.log("Attempting reconnect " + (reconnects+1) + "/5");
        bot.connect();
    }
});

bot.on("message", function(user, userID, channelID, message, evt) {
    const disc = evt.d.author.discriminator;

    if(last_user != user + "#" + disc) {
        color([{
            bg: ["", 0],
            fg: ["", 0],
            msg: "----------\n"
        },{
            bg: ["BWhite", 0],
            fg: ["FBlack", 0],
            msg: " " + user + "#" + disc + " "
        }]);
    }

    message = message.replace(/[\r\n]+/g, " ");
    message = message.replace(/\<:([A-z]+):[0-9]+\>/gi, (_,emote) => ":" + emote + ":");

    color([{
        bg: ["", 0],
        fg: ["", 0],
        msg: " " + message
    }]);

    let args = message.split(" ");
    let cmd = args[0].toLowerCase();

    args = args.splice(1);
    switch(cmd) {
        case "!8ball": case ":8ball:": case "🎱": // That's an 8-ball, yeah
            bot.sendMessage({
                to: channelID,
                message: responses[~~(Math.random()*responses.length)]
            });
            break;
        case "!9ball":
            bot.sendMessage({
                to: channelID,
                message: "Y E S"
            });
            break;
        }
    last_user = user + "#" + disc;
});

let users_stats = {};

bot.on("presence", function(user, userID, status, game, event) {
    if(users_stats[user] == status) return;
    users_stats[user] = status;

    last_user = "";
    let c = "";
    switch(status) {
        case "online":  c = "FGreen";   break;
        case "dnd":     c = "FRed";     break;
        case "idle":    c = "FYellow";  break;
        default:        c = "FWhite";   break;
    }

    color([{
        bg: ["", 0],
        fg: ["", 0],
        msg: "----------\n " + user + " is now "
    }, {
        bg: ["", 0],
        fg: [c, 0],
        msg: status
    }]);
});

function color(msg) {
    let out = COLORS["Reset"];
    for(let i = 0; i < msg.length; i++) {
        if(msg[i].bg[0].length > 0) {
            if(msg[i].bg[1]) {
                out += COLORS[msg[i].bg[0]].split("[").join("[1;");
            } else {
                out += COLORS[msg[i].bg[0]];
            }
        }

        if(msg[i].fg[0].length > 0) {
            if(msg[i].fg[1]) {
                out += COLORS[msg[i].fg[0]].split("[").join("[1;");
            } else {
                out += COLORS[msg[i].fg[0]];
            }
        }

        out += msg[i].msg;
        out += COLORS["Reset"];
    }
    console.log(out);
}