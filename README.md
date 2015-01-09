# modlab

## Idea
Moobot and/or nightbot are nice and all, but first, they cost money for certain features and secondly, even though they have a lot of features, they might not have the exact features that you specifically want or need. I don't need a new viewer notifier, but I want unlimited commands. I don't need a raffle feature, but I want a point system. Moobot/nightbot will not hear you or will tell you that it's too specific and then you wander off to ask someone to do a specific application for you. After that person leaves you though, you're left with nothing again. Modlab aims to solve this problem. With Modlab you have a base that everyone can built upon and people can agree on. When you need a custom feature for your twitch chat, just ask for someone to write a plugin instead of a whole custom application or choose one of those that are already available.

The only downside, to services like Moobot or Nightbot, is that Modlab will need to be hosted per user as we won't provide a hosted version at launch. However, there might be a setup service in place in the future (MAYBE). 

Because we want to serve a wide variety of users, Modlab should be customizable from the name of the bot to the rights a given user will have. You want to allow a given (set of) users to do X task? Sure, why not. Same goes for the plugins; You need X feature? Sure, just add this plugin. Plugins should be easy to install and configure through the main application web interface (and/or chat).

## Philosophy
> Free as in freedom

Modlab should give you the freedom to do whatever you want with it. If you don't like an aspect of the application, you should be able to just turn it off or modify it to your liking. As simple as that. Only for core functionality (for whatever reason you might have) you might need to dig a bit deeper and modify some lines, but that shouldn't be a common thing as this is mostly targeted to streamers and their moderators. From the perspective of a future plugin author, you should not be forced into a small sandbox of features, but instead be able to interact with the application as a whole. If you want to change the UI completely with a plugin, you should at least be able to try. If it interferes with other plugins, then I'm sorry, I cannot forsee that. Of course, it might be better to restrict certain functionality to ensure that every plugin will work in combination with any other plugin, but that would limit the posibilities of what you could do with plugins, which I don't like. Moreover I won't be able to guarantee that everything you access will stay the same, refactoring will happen at some point. Unless it is marked as an API entry point, you have to be aware of the fact that this might change without bigger notice. API parts on the other hand will still contain the old way to give developers some time to update, but I cannot do this for every aspect of the application. I, personally, think trading some backwards compability for the amount of freedom you/I get for it, is well worth it. However, I also agree that having a completely volatile application is bad as well, so ther will be parts of the application that are marked as API and thus officially supported, which means that you should used these parts if you don't want to break other plugins and want to keep compability for many versions.

### Why do I have this opinion?
I have previously worked in as a plugin author for a different project (from my other repositories you might already know which one) which provided an official api to use for developers. However, they were really picky on what they would add to it and what should stay behind closed doors. Don't get me wrong, the API provided a lot of features for us to use, but if you wanted to go further, it wasn't only just not supported, it was really discouraged and systems were put in place to further limit people who used non-API functionality. I was one of the people who used non-API functionality a lot in the end because the API just didn't provide it and there were no API changes in sight that might allow me to do what I want to do with the API. I don't want this to happen here as well. I can certainly say that I will not like certain approaches of changing things and thus will not support them, HOWEVER, I give you the freedom to still do it and won't try to purposely limit what you're doing or make it harder for you. Given, I might unconciously make life hell for you because of a change I made to improve something else, but I cannot be aware of everything. If that happens, you're free to raise your criticism, complains, etc. and I'll see what I can do about it (maybe even provide you with an official way to do it if that's sufficient enough).

### This all seems like you want to move work away from you to plugin authors and the endusers, doesn't it?
As a result of the freedom you get to do what you want, this is required. I cannot make sure that every plugin does work with every other plugin, as mentioned earlier, so it has to be checked from a case to case basis. I might be able to do this in the beginning, but I cannot promise it, so I won't. Moreover, right now I'm the only person contributing to the project and I have other duties to fulfill. This is why I move some work away from me, because if I might not have the means to do it, someone else can do it, if they feel like it. 

## Main architecture
Right now, there will only be one server in place to handle not only the web interface but also the chat messages. It would probably be safer to go for a two server architecture, but we only need to handle one/two chats at once and probably not that many web users.

### Plugins
Plugins will be a big part of the application. The application itself won't provide that many features. It will, however, come with the basic set of things the application needs to operate. Things like rights management, commands and filters should ship with by default (should, however, be possible to disable). Because they play such a big role in this application, it should not only be easy to write a plugin but also be able to interact with the application in all possible ways to ensure that a lot of things can be done from just a plugin. Hooks for UI and events should be provided, a way to schedule tasks and interact with the chat should be the main things to do for a plugin. To ensure some control, a plugin should have a description that contains __version__, __the name of the creator__ and __the name of the plugin itself__. However, the guidelines might change and will probably be more specified later on.

### Rights management
We don't want to force people to have a specific order of rights for people such as Moderators, Editors, Subscribers and Regulars. It is a nice way of handling things, but what if you want more kinds of groups or the opposite? Other moderation bots do not provide such functionality to this extend. So each plugin and the core will provide separate permissions that can be given out to groups or individual people in order to allow such a system. Groups can extend other groups to make things easier to manage but should then be able to override specific ones.

### Chat
Since the chat is where the bot will live most of its life, it should be thought of really well. Reading and writing messages are the core, yes, but it's not as easy. Twitch for example has a limit of message you can send per 30 seconds which should be taken into account. Also, twitch doesn't implement the IRC spec 100%; it changed things here and there to fit their needs. So custom notifications from the twitch servers need to be masked or wrapped. Moreover, twitch might not be the only service we want to use this for, e.g. Hitobx or other kinds of chats. The twitch server can, as any system, get shutdown for a certain period of time, so this needs to be taken into account as well.

### Authentication
The simplest way would be to just say we authenticate via twitch, but what about an admin account that is not bound to a twitch username or when we later want to support other services? Thus we need a way to provide several ways of authentication which, again, should be able to get extended through plugins. Yet, it should still be possible to use several methods of authentication at the same time.

### WebUI
A web interface is simply needed for changing settings as it is almost impossible to do everything via chat. In the beginning we don't need a per-user customizable dashboard or anything very fancy. We don't need an all responsive design. It doesn't need to be fully customizable through plugins. It should just be an alright and comprehensive looking design which has certain points where plugins can integrate functionality into, such as the menu, dashboard widget or the plugin page. However, plugin pages *should* (but don't have to) use the same styles and controls as the rest of the application. 


## Currently used frameworks/technologies and the current state
What works so far? Pretty much just chat and a "Hello world!" web page. Chat can already be extended through other adapters to support different kinds of chats (Woohoo, Hubot!).

Keep in mind, the product is in a really early preparation phase. The core may change suddenly from one framework to another or the backend database may change directly as well. It still has to be proven which technology works best for this kind of application. Below is a list of currently used, at the point fo writing this, technologies:

* Sails as backend
* Bootstrap styling
* (Modified) Hubot for chat

----
### Plugins that *should* be available at launch
* Commands
* Twitch Auth
* User/PW Auth
* Spam filter
* Subscriber notifier
* auto-timeout
* Timed messages
* Chat log
* Better permissions (group inheritance)

### Plugins that *should* follow (soon) after launch
* Hitbox Auth + chat
* live chat in webinterface
