# modlab

## Idea
Moobot and/or nightbot are nice and all, but first, they cost money for certain features and secondly, even though they have a lot of features, they might not have the exact features that you specifically want or need. I don't need a new viewer notifier, but I want unlimited commands. I don't need a raffle feature, but I want a point system. Moobot/nightbot will not hear you or will tell you that it's too specific and then you wander off to ask someone to do a specific application for you. After he leaves you though, you're left with nothing again. ModLab aims to solve this problem. With ModLab you have a base that everyone can built upon and people can agree on. When you need a custom feature for your twitch chat, just ask for someone to write a plugin instead of a whole custom application.

The only downside is that ModLab will need to be hosted per user as we won't provide a hosted version at launch. However, there might be a setup service in place in ther future (MAYBE). 

Because we want to serve a wide variety of users, ModLab should be customizable from the name of the bot to the rights a given user will have. You want to allow a given (set of) users to do X task? Sure, why not. Same goes for the plugins; You need X feature? Sure, just add this plugin. Plugins should be easy to install and configure through the main application web interface (and/or chat).

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