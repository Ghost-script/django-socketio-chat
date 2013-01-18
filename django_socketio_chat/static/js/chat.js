// Generated by CoffeeScript 1.4.0
(function() {
  var Chat, ChatApp, ParticipantList, UserList, UserState,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  UserState = (function() {

    function UserState(conn) {
      var session_state_dropdown_el,
        _this = this;
      this.conn = conn;
      this.clear_btn_classes = __bind(this.clear_btn_classes, this);

      this.set_signed_off = __bind(this.set_signed_off, this);

      this.set_invisible = __bind(this.set_invisible, this);

      this.set_busy = __bind(this.set_busy, this);

      this.set_available = __bind(this.set_available, this);

      this.session_state_el = $('.session-state');
      session_state_dropdown_el = $("<div class=\"btn-group\">\n    <a class=\"btn dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">\n        <span class=\"state\"></span>\n        <span class=\"caret\"></span>\n    </a>\n    <ul class=\"dropdown-menu right-align-dropdown\">\n        <li><a class=\"become-available\" href=\"#\">Available</a></li>\n        <li><a class=\"become-busy\" href=\"#\">Busy</a></li>\n        <li><a class=\"become-invisible\" href=\"#\">Invisible</a></li>\n        <li><a class=\"sign-off\" href=\"#\">Sign off</a></li>\n    </ul>\n</div>");
      this.session_state_el.html(session_state_dropdown_el);
      session_state_dropdown_el.find('.become-available').click(function(e) {
        e.preventDefault();
        return _this.conn.emit('req_user_become_available');
      });
      session_state_dropdown_el.find('.become-busy').click(function(e) {
        e.preventDefault();
        return _this.conn.emit('req_user_become_busy');
      });
      session_state_dropdown_el.find('.become-invisible').click(function(e) {
        e.preventDefault();
        return _this.conn.emit('req_user_become_invisible');
      });
      session_state_dropdown_el.find('.sign-off').click(function(e) {
        e.preventDefault();
        return _this.conn.emit('req_user_sign_off');
      });
    }

    UserState.prototype.set_available = function() {
      var $chat_window;
      $chat_window = $('.chat-window');
      $chat_window.show();
      this.session_state_el.find('.state').html('Available');
      this.clear_btn_classes();
      return this.session_state_el.find('.btn').addClass('btn-success');
    };

    UserState.prototype.set_busy = function() {
      var $chat_window;
      $chat_window = $('.chat-window');
      $chat_window.show();
      this.session_state_el.find('.state').html('Busy');
      this.clear_btn_classes();
      return this.session_state_el.find('.btn').addClass('btn-danger');
    };

    UserState.prototype.set_invisible = function() {
      var $chat_window;
      $chat_window = $('.chat-window');
      $chat_window.show();
      this.session_state_el.find('.state').html('Invisible');
      this.clear_btn_classes();
      return this.session_state_el.find('.btn').addClass('btn-inverse');
    };

    UserState.prototype.set_signed_off = function() {
      var $chat_window;
      $chat_window = $('.chat-window');
      $chat_window.hide();
      return this.session_state_el.find('.state').html('Signed off');
    };

    UserState.prototype.clear_btn_classes = function() {
      return this.session_state_el.find('.btn').removeClass('btn-success btn-danger btn-inverse');
    };

    return UserState;

  })();

  UserList = (function() {

    function UserList(conn) {
      this.conn = conn;
      this.set_user_list = __bind(this.set_user_list, this);

      this.get_user_list = __bind(this.get_user_list, this);

      this.user_list_el = $('.users .user-list');
      this.user_list = [];
    }

    UserList.prototype.get_user_list = function() {
      return this.user_list;
    };

    UserList.prototype.set_user_list = function(users) {
      var $user_el, user, _i, _len,
        _this = this;
      this.user_list = users;
      this.user_list_el.empty();
      for (_i = 0, _len = users.length; _i < _len; _i++) {
        user = users[_i];
        $user_el = $("<li class=\"" + user.status + "\" data-username=\"" + user.username + "\">\n    <a href=\"#\">\n        <i class=\"icon-user\"></i>\n        " + user.username + "\n    </a>\n</li>");
        this.user_list_el.append($user_el);
      }
      return this.user_list_el.on('click', 'li', function(e) {
        e.preventDefault();
        return _this.conn.emit('req_chat_create', $(e.currentTarget).data('username'));
      });
    };

    return UserList;

  })();

  ParticipantList = (function() {

    function ParticipantList(chat_session, chat_el, user_chat_statuses) {
      this.chat_session = chat_session;
      this.user_chat_statuses = user_chat_statuses;
      this.set_user_status = __bind(this.set_user_status, this);

      this.set_participant_list = __bind(this.set_participant_list, this);

      this.participant_list_el = $('<ul class="participant-list unstyled" />');
      this.set_participant_list(user_chat_statuses);
      chat_el.find('.chat-header').append(this.participant_list_el);
    }

    ParticipantList.prototype.set_participant_list = function(user_chat_statuses) {
      var $user_el, user_chat_status, _i, _len, _results;
      this.user_chat_statuses = user_chat_statuses;
      this.participant_list_el.empty();
      _results = [];
      for (_i = 0, _len = user_chat_statuses.length; _i < _len; _i++) {
        user_chat_status = user_chat_statuses[_i];
        if (user_chat_status.user.username !== this.chat_session.username) {
          $user_el = $("<li class=\"" + user_chat_status.user.status + " " + user_chat_status.user.username + "\">" + user_chat_status.user.username + "</li>");
          _results.push(this.participant_list_el.append($user_el));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ParticipantList.prototype.set_user_status = function(username, status) {
      var ucs, _i, _len, _ref;
      _ref = this.user_chat_statuses;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ucs = _ref[_i];
        if (ucs.user.username === username) {
          ucs.user.status = status;
        }
      }
      return this.set_participant_list(this.user_chat_statuses);
    };

    return ParticipantList;

  })();

  Chat = (function() {

    function Chat(conn, chat_session, chat, user_list) {
      var $chat_active_toggle, $message_input_el, $messages_el, message, self, _i, _len, _ref,
        _this = this;
      this.conn = conn;
      this.chat_session = chat_session;
      this.chat = chat;
      this.user_list = user_list;
      this.update_add_user_list = __bind(this.update_add_user_list, this);

      this.ui_scroll_down = __bind(this.ui_scroll_down, this);

      this.set_unread_messages = __bind(this.set_unread_messages, this);

      this.archive = __bind(this.archive, this);

      this.deactivate = __bind(this.deactivate, this);

      this.activate = __bind(this.activate, this);

      this.new_message = __bind(this.new_message, this);

      this.add_message = __bind(this.add_message, this);

      this.is_active = __bind(this.is_active, this);

      this.chat_el = $("<div id=\"chat-" + chat.uuid + "\" class=\"chat well well-small\">\n    <div class=\"chat-header toggle-active clearfix\"></div>\n</div>");
      this.participant_list = new ParticipantList(this.chat_session, this.chat_el, this.chat.user_chat_statuses);
      this.chat_el.find('.chat-header').after($("<div class=\"chat-controls\">\n    <div class=\"btn-group\">\n        <a class=\"btn btn-small dropdown-toggle btn-show-add-user-list\" data-toggle=\"dropdown\" href=\"#\">\n            <i class=\"icon-plus\"></i>\n        </a>\n        <ul class=\"dropdown-menu chat-user-list right-align-dropdown\"></ul>\n    </div>\n    <a href=\"#\" class=\"archive btn btn-small\"><i class=\"icon-remove\"></i></a>\n    <div class=\"unread-messages badge\"></div>\n</div>"));
      $messages_el = $('<div class="messages"><div class="messages-inner clearfix"></div></div>');
      this.chat_el.append($messages_el);
      $message_input_el = $("<div class=\"message-input input-prepend\">\n    <div class=\"add-on\"><i class=\"icon-user\"></i></div>\n    <input type=\"text\" placeholder=\"Type message\">\n</div>");
      this.chat_el.append($message_input_el);
      self = this;
      $message_input_el.find('input').keypress(function(e) {
        if (e.which === 13) {
          e.preventDefault();
          if (this.value === '') {
            return;
          }
          self.conn.emit('req_message_send', this.value, chat.uuid);
          return this.value = '';
        }
      });
      $chat_active_toggle = this.chat_el.find('.toggle-active');
      $chat_active_toggle.click(function(e) {
        e.preventDefault();
        if ($chat_active_toggle.hasClass('js_active')) {
          return _this.conn.emit('req_chat_deactivate', chat.uuid);
        } else {
          return _this.conn.emit('req_chat_activate', chat.uuid);
        }
      });
      $chat_active_toggle.mousedown(function(e) {
        return e.preventDefault();
      });
      this.chat_el.find('.btn-show-add-user-list').click(function(e) {
        e.preventDefault();
        return _this.update_add_user_list();
      });
      this.chat_el.find('.archive').click(function(e) {
        e.preventDefault();
        return _this.conn.emit('req_chat_archive', chat.uuid);
      });
      $('.chat-list').append(this.chat_el);
      if (this.is_active()) {
        this.activate();
      } else {
        this.deactivate();
        this.set_unread_messages(user_chat_status.unread_messages);
      }
      if (this.chat.messages.length > 0) {
        _ref = chat.messages;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          message = _ref[_i];
          this.add_message(message);
        }
        this.ui_scroll_down();
      }
    }

    Chat.prototype.is_active = function() {
      var ucs, _i, _len, _ref;
      _ref = this.chat.user_chat_statuses;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ucs = _ref[_i];
        if (ucs.user.username === this.chat_session.username && ucs.status === 'active') {
          return true;
        }
      }
    };

    Chat.prototype.add_message = function(message, user_chat_statuses) {
      var $message_el, stamp,
        _this = this;
      stamp = function(timestamp) {
        timestamp = new Date(timestamp);
        return ('0' + timestamp.getHours()).slice(-2) + ':' + ('0' + timestamp.getMinutes()).slice(-2);
      };
      $message_el = $("<blockquote id=\"message-" + message.uuid + "\" class=\"message\n    " + (message.user_from__username === this.chat_session.username ? ' pull-right\"' : '\"') + ">\n    <p class=\"msg-body\">" + message.message_body + "</p>\n    <small class=\"msg-sender-timestamp\">" + message.user_from__username + " - " + (stamp(message.timestamp)) + "</small>\n</blockquote>");
      return this.chat_el.find('.messages-inner').append($message_el);
    };

    Chat.prototype.new_message = function(message, user_chat_statuses) {
      this.add_message(message, user_chat_statuses);
      return this.ui_scroll_down(true);
    };

    Chat.prototype.activate = function() {
      this.chat_el.find('.toggle-active').addClass('js_active');
      this.chat_el.find('.messages, .message-input').show();
      this.set_unread_messages();
      return this.ui_scroll_down();
    };

    Chat.prototype.deactivate = function() {
      this.chat_el.find('.toggle-active').removeClass('js_active');
      return this.chat_el.find('.messages, .message-input').hide();
    };

    Chat.prototype.archive = function() {
      return this.chat_el.remove();
    };

    Chat.prototype.set_unread_messages = function(count) {
      var unread_messages;
      if (count == null) {
        count = 0;
      }
      unread_messages = this.chat_el.find('.unread-messages');
      if (count > 0) {
        return unread_messages.html(count).addClass('active');
      } else {
        return unread_messages.html('').removeClass('active');
      }
    };

    Chat.prototype.ui_scroll_down = function(animate) {
      var $messages_el, $messages_inner_el;
      if (animate == null) {
        animate = false;
      }
      $messages_el = this.chat_el.find('.messages');
      $messages_inner_el = this.chat_el.find('.messages-inner');
      if (animate) {
        return $messages_el.animate({
          scrollTop: $messages_inner_el.outerHeight()
        }, 1000);
      } else {
        return $messages_el.scrollTop($messages_inner_el.outerHeight());
      }
    };

    Chat.prototype.update_add_user_list = function() {
      var $chat_user_list, user, _i, _len, _ref, _results,
        _this = this;
      $chat_user_list = this.chat_el.find('.chat-user-list');
      $chat_user_list.empty();
      _ref = this.user_list.get_user_list();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        user = _ref[_i];
        $chat_user_list.append($("<li>\n    <a href=\"#\" class=\"user-add\" data-username=\"" + user.username + "\">\n        <i class=\"icon-user\"></i>\n        " + user.username + "\n    </a>\n</li>"));
        _results.push($chat_user_list.on('click', '.user-add', function(e) {
          e.preventDefault();
          return _this.conn.emit('req_chat_add_user', _this.chat.uuid, $(e.currentTarget).data('username'));
        }));
      }
      return _results;
    };

    return Chat;

  })();

  ChatApp = (function() {

    function ChatApp() {
      this.connect = __bind(this.connect, this);

      this.debug_log = __bind(this.debug_log, this);
      this.chat_session = null;
      this.chats = {};
      this.connect();
      this.user_state = new UserState(this.conn);
      this.user_list = new UserList(this.conn);
    }

    ChatApp.prototype.debug_log = function(msg) {
      var control, now;
      control = $('.debug-log');
      now = new Date();
      return control.append(now.toLocaleTimeString() + ': ' + msg + '<br/>');
    };

    ChatApp.prototype.connect = function() {
      var _this = this;
      this.conn = io.connect('https://' + window.location.host, {
        'force_new_connection': false,
        'rememberTransport': true,
        'resource': 'chat/socket.io'
      });
      this.debug_log('Connecting...');
      this.conn.on('connect', function() {
        return _this.debug_log('Connected');
      });
      this.conn.on('ev_chat_session_status', function(chat_session) {
        _this.chat_session = chat_session;
        if (_this.chat_session.status === 0) {
          return _this.user_state.set_signed_off();
        }
      });
      this.conn.on('ev_data_update', function(chat_session, chat_users, chats) {
        var chat, _i, _len, _results;
        _this.chat_session = chat_session;
        if (_this.chat_session.status === 1) {
          _this.user_state.set_available();
        }
        if (_this.chat_session.status === 2) {
          _this.user_state.set_invisible();
        }
        if (_this.chat_session.status === 3) {
          _this.user_state.set_busy();
        }
        _this.user_list.set_user_list(chat_users);
        $('.chat-list').empty();
        _results = [];
        for (_i = 0, _len = chats.length; _i < _len; _i++) {
          chat = chats[_i];
          _results.push(_this.chats[chat.uuid] = new Chat(_this.conn, _this.chat_session, chat, _this.user_list));
        }
        return _results;
      });
      this.conn.on('disconnect', function(data) {
        _this.debug_log('Disconnect');
        return _this.conn = null;
      });
      this.conn.on('ev_user_became_available', function(username, users) {
        var chat, chat_uuid, _ref, _results;
        _this.debug_log("" + username + " became available.");
        _this.user_list.set_user_list(users);
        _ref = _this.chats;
        _results = [];
        for (chat_uuid in _ref) {
          chat = _ref[chat_uuid];
          _results.push(chat.participant_list.set_user_status(username, 'available'));
        }
        return _results;
      });
      this.conn.on('ev_user_became_busy', function(username, users) {
        var chat, chat_uuid, _ref, _results;
        _this.debug_log("" + username + " became busy.");
        _this.user_list.set_user_list(users);
        _ref = _this.chats;
        _results = [];
        for (chat_uuid in _ref) {
          chat = _ref[chat_uuid];
          _results.push(chat.participant_list.set_user_status(username, 'busy'));
        }
        return _results;
      });
      this.conn.on('ev_user_signed_off', function(username, users) {
        var chat, chat_uuid, _ref, _results;
        _this.debug_log("" + username + " signed off.");
        _this.user_list.set_user_list(users);
        _ref = _this.chats;
        _results = [];
        for (chat_uuid in _ref) {
          chat = _ref[chat_uuid];
          _results.push(chat.participant_list.set_user_status(username, 'offline'));
        }
        return _results;
      });
      this.conn.on('ev_chat_created', function(chat) {
        return _this.chats[chat.uuid] = new Chat(_this.conn, _this.chat_session, chat, _this.user_list);
      });
      this.conn.on('ev_you_were_added', function(chat) {
        return _this.chats[chat.uuid] = new Chat(_this.conn, _this.chat_session, chat, _this.user_list);
      });
      this.conn.on('ev_chat_user_added', function(chat_uuid, username, user_chat_statuses) {
        return _this.chats[chat_uuid].participant_list.set_participant_list(user_chat_statuses);
      });
      this.conn.on('ev_message_sent', function(message, user_chat_statuses) {
        return _this.chats[message.chat__uuid].new_message(message, user_chat_statuses);
      });
      this.conn.on('ev_chat_activated', function(chat_uuid) {
        return _this.chats[chat_uuid].activate();
      });
      this.conn.on('ev_chat_deactivated', function(chat_uuid) {
        return _this.chats[chat_uuid].deactivate();
      });
      return this.conn.on('ev_chat_archived', function(chat_uuid) {
        return _this.chats[chat_uuid].archive();
      });
    };

    return ChatApp;

  })();

  $(function() {
    return new ChatApp();
  });

}).call(this);
