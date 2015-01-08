# Plugins

## Kinds of plugins
* [Authentication provider](#authentication-provider)
* [Chat provider](#chat-provider)
* [Modlab Plugin](#modlab-plugin)

### Authentication provider
An authentication provider provides a way to authenticate with the service, not the chat. There can be multiple authentication provider enabled at the same time and a user can authenticate via one of those providers. Every provider is a normal [Passport](http://passportjs.org/) provider and can be installed via NPM. Enabled providers are configured in the `config\passport.js` configuration.

### Chat provider
A chat provider tell modlab how to interact with the given chat, that includes connection, login, sending and receiving messages. It can also provide custom functionality to plugins, however, modlab might not be able to use them. The chat is built on a modified version of hubot, so *most* adapters should work just fine. Same as with the authentication providers, these providers should be installed via NPM. However, you can only connect via one provider at the same time. Chat providers can be configured in `config\chat.js`.

### Modlab plugin
A modlab plugin enables new functionality for the application itself. May it be dashboard functionality, enhanced layouts, chat commands, etc. . A modlab plugin can be installed in two ways: npm or inside the `plugins` directory. You can configure the enabled plugins in the `config\plugins.js` file.
