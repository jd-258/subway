/** @jsx React.DOM */

app.components.messages = function() {
  var KickMessage = React.createBackboneClass({
    render: function() {
      return (
        <div className={this.getModel().getClass()}>
          <div>* <strong>{this.getModel().get("nick")}</strong> has kicked <strong>{this.getModel().get("text") + " "}</strong><em>**{this.getModel().get("reason")}**</em></div>
        </div>
      );
    }
  });

  var ActionMessage = React.createBackboneClass({
    render: function() {
      return (
        <div className={this.getModel().getClass()}>
          <div>* <strong>{this.getModel().get("from")}</strong><span>{'\u0020' + this.getModel().get("text")}</span></div>
        </div>
      );
    }
  });

  var NickMessage = React.createBackboneClass({
    render: function() {
      return (
        <div className={this.getModel().getClass()}>
          <div><strong>{this.getModel().get("nick")}</strong> is now known as {this.getModel().get("text")}</div>
        </div>
      );
    }
  });

  var PartMessage = React.createBackboneClass({
    render: function() {
      return (
        <div className={this.getModel().getClass()}>
          <div><i className="fa fa-sign-out"></i><strong>{this.getModel().get("nick")}</strong> has left ({this.getModel().get("text")})</div>
        </div>
      );
    }
  });

  var QuitMessage = React.createBackboneClass({
    render: function() {
      return (
        <div className={this.getModel().getClass()}>
          <div><i className="fa fa-sign-out"></i><strong>{this.getModel().get("nick")}</strong> has quit ({this.getModel().get("text")})</div>
        </div>
      );
    }
  });

  var JoinMessage = React.createBackboneClass({
    render: function() {
      return (
        <div className={this.getModel().getClass()}>
          <div><i className="fa fa-sign-in"></i><strong>{this.getModel().get("nick")}</strong> has joined</div>
        </div>
      );
    }
  });

  var TopicMessage = React.createBackboneClass({
    render: function() {
      return (
        <div className={this.getModel().getClass()}>
          <div><i className="fa fa-info-circle"></i><strong>{this.getModel().get("nick")}</strong> has changed the topic to "{this.getModel().get("text")}"</div>
        </div>
      );
    }
  });

  var ModeMessage = React.createBackboneClass({
    render: function() {
      return (
        <div className={this.getModel().getClass()}>
          <div>Mode ["{this.getModel().get("mode")}" <strong>{this.getModel().get("text")}</strong>] by <strong>{this.getModel().get("from")}</strong></div>
        </div>
      );
    }
  });

  var Message = React.createBackboneClass({
    attachListeners: function() {
      var _this = this;
      this.processedText.listeners.map(function(listener) {
        if (listener) {
          listener.call(_this);
        }
      });
    },

    componentDidUpdate: function() {
      this.attachListeners();
    },

    componentDidMount: function() {
      this.attachListeners();
    },

    render: function() {
      this.processedText = this.getModel().getText();

      return (
        <div className={this.getModel().getClass()}>
          <div className="messageAuthor">
            {this.getModel().get("from")}
          </div>
          <div className="messageText" dangerouslySetInnerHTML={{__html: this.processedText.text}}>
          {this.isMounted() ? this.attachListeners() : undefined}
          </div>
          <div className="messageTimestamp">
            {this.getModel().get("timestamp") ? moment(this.getModel().get("timestamp")).format(app.settings.time_format) : ""}
          </div>
        </div>
      );
    }
  });

  var Messages = React.createBackboneClass({
    componentDidUpdate: function() {
      var node = this.getDOMNode();
      this.shouldScrollBottom = node.scrollTop + node.offsetHeight < node.scrollHeight;

      if (this.shouldScrollBottom) {
        var node = this.getDOMNode();
        $(node).animate({scrollTop: node.scrollHeight}, 750);
      }
    },

    render: function() {
      return (
        <div className="messages">
          {this.getModel().map(function(message) {
            if (!(_.contains(app.settings.enabled_types, message.get("type")))) {
              return;
            }

            switch (message.get("type")) {
              case "PRIVMSG":
                return <Message model={message} />
              case "NOTICE":
                return <Message model={message} />
              case "MODE":
                return <ModeMessage model={message} />
              case "PART":
                return <PartMessage model={message} />
              case "QUIT":
                return <QuitMessage model={message} />
              case "KICK":
                return <KickMessage model={message} />
              case "JOIN":
                return <JoinMessage model={message} />
              case "TOPIC":
                return <TopicMessage model={message} />
              case "NICK":
                return <NickMessage model={message} />
              case "ACTION":
                return <ActionMessage model={message} />
            }
          })}
        </div>
      );
    }
  });

  return Messages;
};
