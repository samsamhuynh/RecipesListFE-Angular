import {
  ArgumentOutOfRangeError,
  AsyncAction,
  AsyncScheduler,
  AsyncSubject,
  BehaviorSubject,
  ConnectableObservable,
  EMPTY,
  EmptyError,
  GroupedObservable,
  Notification,
  NotificationKind,
  ObjectUnsubscribedError,
  Observable,
  ReplaySubject,
  Scheduler,
  Subject,
  Subscriber,
  Subscription,
  TimeoutError,
  UnsubscriptionError,
  __esm,
  __export,
  __extends,
  asap,
  asapScheduler,
  async,
  asyncScheduler,
  canReportError,
  combineLatest,
  concat,
  config,
  defer,
  empty,
  filter,
  from,
  identity,
  init_ArgumentOutOfRangeError,
  init_AsyncAction,
  init_AsyncScheduler,
  init_AsyncSubject,
  init_BehaviorSubject,
  init_ConnectableObservable,
  init_EmptyError,
  init_Notification,
  init_ObjectUnsubscribedError,
  init_Observable,
  init_ReplaySubject,
  init_Scheduler,
  init_Subject,
  init_Subscriber,
  init_Subscription,
  init_TimeoutError,
  init_UnsubscriptionError,
  init_asap,
  init_async,
  init_canReportError,
  init_combineLatest,
  init_concat,
  init_config,
  init_defer,
  init_empty,
  init_filter,
  init_from,
  init_groupBy,
  init_identity,
  init_isArray,
  init_isFunction,
  init_isNumeric,
  init_isObject,
  init_isScheduler,
  init_map,
  init_merge,
  init_noop,
  init_not,
  init_observable,
  init_of,
  init_pipe,
  init_queue,
  init_race,
  init_scheduled,
  init_subscribeTo,
  init_throwError,
  init_timer,
  init_tslib_es6,
  init_zip,
  isArray,
  isFunction,
  isNumeric,
  isObject,
  isScheduler,
  map,
  merge,
  noop,
  not,
  observable,
  of,
  pipe,
  queue,
  queueScheduler,
  race,
  scheduled,
  subscribeTo,
  throwError,
  timer,
  zip
} from "./chunk-B6S5TRUD.js";

// node_modules/rxjs/_esm5/internal/scheduler/AnimationFrameAction.js
var AnimationFrameAction;
var init_AnimationFrameAction = __esm({
  "node_modules/rxjs/_esm5/internal/scheduler/AnimationFrameAction.js"() {
    init_tslib_es6();
    init_AsyncAction();
    AnimationFrameAction = function(_super) {
      __extends(AnimationFrameAction2, _super);
      function AnimationFrameAction2(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
      }
      AnimationFrameAction2.prototype.requestAsyncId = function(scheduler, id, delay) {
        if (delay === void 0) {
          delay = 0;
        }
        if (delay !== null && delay > 0) {
          return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        scheduler.actions.push(this);
        return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function() {
          return scheduler.flush(null);
        }));
      };
      AnimationFrameAction2.prototype.recycleAsyncId = function(scheduler, id, delay) {
        if (delay === void 0) {
          delay = 0;
        }
        if (delay !== null && delay > 0 || delay === null && this.delay > 0) {
          return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
        }
        if (scheduler.actions.length === 0) {
          cancelAnimationFrame(id);
          scheduler.scheduled = void 0;
        }
        return void 0;
      };
      return AnimationFrameAction2;
    }(AsyncAction);
  }
});

// node_modules/rxjs/_esm5/internal/scheduler/AnimationFrameScheduler.js
var AnimationFrameScheduler;
var init_AnimationFrameScheduler = __esm({
  "node_modules/rxjs/_esm5/internal/scheduler/AnimationFrameScheduler.js"() {
    init_tslib_es6();
    init_AsyncScheduler();
    AnimationFrameScheduler = function(_super) {
      __extends(AnimationFrameScheduler2, _super);
      function AnimationFrameScheduler2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      AnimationFrameScheduler2.prototype.flush = function(action) {
        this.active = true;
        this.scheduled = void 0;
        var actions = this.actions;
        var error;
        var index = -1;
        var count = actions.length;
        action = action || actions.shift();
        do {
          if (error = action.execute(action.state, action.delay)) {
            break;
          }
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
          while (++index < count && (action = actions.shift())) {
            action.unsubscribe();
          }
          throw error;
        }
      };
      return AnimationFrameScheduler2;
    }(AsyncScheduler);
  }
});

// node_modules/rxjs/_esm5/internal/scheduler/animationFrame.js
var animationFrameScheduler, animationFrame;
var init_animationFrame = __esm({
  "node_modules/rxjs/_esm5/internal/scheduler/animationFrame.js"() {
    init_AnimationFrameAction();
    init_AnimationFrameScheduler();
    animationFrameScheduler = new AnimationFrameScheduler(AnimationFrameAction);
    animationFrame = animationFrameScheduler;
  }
});

// node_modules/rxjs/_esm5/internal/scheduler/VirtualTimeScheduler.js
var VirtualTimeScheduler, VirtualAction;
var init_VirtualTimeScheduler = __esm({
  "node_modules/rxjs/_esm5/internal/scheduler/VirtualTimeScheduler.js"() {
    init_tslib_es6();
    init_AsyncAction();
    init_AsyncScheduler();
    VirtualTimeScheduler = function(_super) {
      __extends(VirtualTimeScheduler2, _super);
      function VirtualTimeScheduler2(SchedulerAction, maxFrames) {
        if (SchedulerAction === void 0) {
          SchedulerAction = VirtualAction;
        }
        if (maxFrames === void 0) {
          maxFrames = Number.POSITIVE_INFINITY;
        }
        var _this = _super.call(this, SchedulerAction, function() {
          return _this.frame;
        }) || this;
        _this.maxFrames = maxFrames;
        _this.frame = 0;
        _this.index = -1;
        return _this;
      }
      VirtualTimeScheduler2.prototype.flush = function() {
        var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
        var error, action;
        while ((action = actions[0]) && action.delay <= maxFrames) {
          actions.shift();
          this.frame = action.delay;
          if (error = action.execute(action.state, action.delay)) {
            break;
          }
        }
        if (error) {
          while (action = actions.shift()) {
            action.unsubscribe();
          }
          throw error;
        }
      };
      VirtualTimeScheduler2.frameTimeFactor = 10;
      return VirtualTimeScheduler2;
    }(AsyncScheduler);
    VirtualAction = function(_super) {
      __extends(VirtualAction2, _super);
      function VirtualAction2(scheduler, work, index) {
        if (index === void 0) {
          index = scheduler.index += 1;
        }
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        _this.index = index;
        _this.active = true;
        _this.index = scheduler.index = index;
        return _this;
      }
      VirtualAction2.prototype.schedule = function(state, delay) {
        if (delay === void 0) {
          delay = 0;
        }
        if (!this.id) {
          return _super.prototype.schedule.call(this, state, delay);
        }
        this.active = false;
        var action = new VirtualAction2(this.scheduler, this.work);
        this.add(action);
        return action.schedule(state, delay);
      };
      VirtualAction2.prototype.requestAsyncId = function(scheduler, id, delay) {
        if (delay === void 0) {
          delay = 0;
        }
        this.delay = scheduler.frame + delay;
        var actions = scheduler.actions;
        actions.push(this);
        actions.sort(VirtualAction2.sortActions);
        return true;
      };
      VirtualAction2.prototype.recycleAsyncId = function(scheduler, id, delay) {
        if (delay === void 0) {
          delay = 0;
        }
        return void 0;
      };
      VirtualAction2.prototype._execute = function(state, delay) {
        if (this.active === true) {
          return _super.prototype._execute.call(this, state, delay);
        }
      };
      VirtualAction2.sortActions = function(a, b) {
        if (a.delay === b.delay) {
          if (a.index === b.index) {
            return 0;
          } else if (a.index > b.index) {
            return 1;
          } else {
            return -1;
          }
        } else if (a.delay > b.delay) {
          return 1;
        } else {
          return -1;
        }
      };
      return VirtualAction2;
    }(AsyncAction);
  }
});

// node_modules/rxjs/_esm5/internal/util/isObservable.js
function isObservable(obj) {
  return !!obj && (obj instanceof Observable || typeof obj.lift === "function" && typeof obj.subscribe === "function");
}
var init_isObservable = __esm({
  "node_modules/rxjs/_esm5/internal/util/isObservable.js"() {
    init_Observable();
  }
});

// node_modules/rxjs/_esm5/internal/observable/bindCallback.js
function bindCallback(callbackFunc, resultSelector, scheduler) {
  if (resultSelector) {
    if (isScheduler(resultSelector)) {
      scheduler = resultSelector;
    } else {
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return bindCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map(function(args2) {
          return isArray(args2) ? resultSelector.apply(void 0, args2) : resultSelector(args2);
        }));
      };
    }
  }
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var context = this;
    var subject;
    var params = {
      context,
      subject,
      callbackFunc,
      scheduler
    };
    return new Observable(function(subscriber) {
      if (!scheduler) {
        if (!subject) {
          subject = new AsyncSubject();
          var handler = function() {
            var innerArgs = [];
            for (var _i2 = 0; _i2 < arguments.length; _i2++) {
              innerArgs[_i2] = arguments[_i2];
            }
            subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
            subject.complete();
          };
          try {
            callbackFunc.apply(context, args.concat([handler]));
          } catch (err) {
            if (canReportError(subject)) {
              subject.error(err);
            } else {
              console.warn(err);
            }
          }
        }
        return subject.subscribe(subscriber);
      } else {
        var state = {
          args,
          subscriber,
          params
        };
        return scheduler.schedule(dispatch, 0, state);
      }
    });
  };
}
function dispatch(state) {
  var _this = this;
  var self = this;
  var args = state.args, subscriber = state.subscriber, params = state.params;
  var callbackFunc = params.callbackFunc, context = params.context, scheduler = params.scheduler;
  var subject = params.subject;
  if (!subject) {
    subject = params.subject = new AsyncSubject();
    var handler = function() {
      var innerArgs = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        innerArgs[_i] = arguments[_i];
      }
      var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
      _this.add(scheduler.schedule(dispatchNext, 0, { value, subject }));
    };
    try {
      callbackFunc.apply(context, args.concat([handler]));
    } catch (err) {
      subject.error(err);
    }
  }
  this.add(subject.subscribe(subscriber));
}
function dispatchNext(state) {
  var value = state.value, subject = state.subject;
  subject.next(value);
  subject.complete();
}
var init_bindCallback = __esm({
  "node_modules/rxjs/_esm5/internal/observable/bindCallback.js"() {
    init_Observable();
    init_AsyncSubject();
    init_map();
    init_canReportError();
    init_isArray();
    init_isScheduler();
  }
});

// node_modules/rxjs/_esm5/internal/observable/bindNodeCallback.js
function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
  if (resultSelector) {
    if (isScheduler(resultSelector)) {
      scheduler = resultSelector;
    } else {
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return bindNodeCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map(function(args2) {
          return isArray(args2) ? resultSelector.apply(void 0, args2) : resultSelector(args2);
        }));
      };
    }
  }
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var params = {
      subject: void 0,
      args,
      callbackFunc,
      scheduler,
      context: this
    };
    return new Observable(function(subscriber) {
      var context = params.context;
      var subject = params.subject;
      if (!scheduler) {
        if (!subject) {
          subject = params.subject = new AsyncSubject();
          var handler = function() {
            var innerArgs = [];
            for (var _i2 = 0; _i2 < arguments.length; _i2++) {
              innerArgs[_i2] = arguments[_i2];
            }
            var err = innerArgs.shift();
            if (err) {
              subject.error(err);
              return;
            }
            subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
            subject.complete();
          };
          try {
            callbackFunc.apply(context, args.concat([handler]));
          } catch (err) {
            if (canReportError(subject)) {
              subject.error(err);
            } else {
              console.warn(err);
            }
          }
        }
        return subject.subscribe(subscriber);
      } else {
        return scheduler.schedule(dispatch2, 0, { params, subscriber, context });
      }
    });
  };
}
function dispatch2(state) {
  var _this = this;
  var params = state.params, subscriber = state.subscriber, context = state.context;
  var callbackFunc = params.callbackFunc, args = params.args, scheduler = params.scheduler;
  var subject = params.subject;
  if (!subject) {
    subject = params.subject = new AsyncSubject();
    var handler = function() {
      var innerArgs = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        innerArgs[_i] = arguments[_i];
      }
      var err = innerArgs.shift();
      if (err) {
        _this.add(scheduler.schedule(dispatchError, 0, { err, subject }));
      } else {
        var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
        _this.add(scheduler.schedule(dispatchNext2, 0, { value, subject }));
      }
    };
    try {
      callbackFunc.apply(context, args.concat([handler]));
    } catch (err) {
      this.add(scheduler.schedule(dispatchError, 0, { err, subject }));
    }
  }
  this.add(subject.subscribe(subscriber));
}
function dispatchNext2(arg) {
  var value = arg.value, subject = arg.subject;
  subject.next(value);
  subject.complete();
}
function dispatchError(arg) {
  var err = arg.err, subject = arg.subject;
  subject.error(err);
}
var init_bindNodeCallback = __esm({
  "node_modules/rxjs/_esm5/internal/observable/bindNodeCallback.js"() {
    init_Observable();
    init_AsyncSubject();
    init_map();
    init_canReportError();
    init_isScheduler();
    init_isArray();
  }
});

// node_modules/rxjs/_esm5/internal/observable/forkJoin.js
function forkJoin() {
  var sources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }
  if (sources.length === 1) {
    var first_1 = sources[0];
    if (isArray(first_1)) {
      return forkJoinInternal(first_1, null);
    }
    if (isObject(first_1) && Object.getPrototypeOf(first_1) === Object.prototype) {
      var keys = Object.keys(first_1);
      return forkJoinInternal(keys.map(function(key) {
        return first_1[key];
      }), keys);
    }
  }
  if (typeof sources[sources.length - 1] === "function") {
    var resultSelector_1 = sources.pop();
    sources = sources.length === 1 && isArray(sources[0]) ? sources[0] : sources;
    return forkJoinInternal(sources, null).pipe(map(function(args) {
      return resultSelector_1.apply(void 0, args);
    }));
  }
  return forkJoinInternal(sources, null);
}
function forkJoinInternal(sources, keys) {
  return new Observable(function(subscriber) {
    var len = sources.length;
    if (len === 0) {
      subscriber.complete();
      return;
    }
    var values = new Array(len);
    var completed = 0;
    var emitted = 0;
    var _loop_1 = function(i2) {
      var source = from(sources[i2]);
      var hasValue = false;
      subscriber.add(source.subscribe({
        next: function(value) {
          if (!hasValue) {
            hasValue = true;
            emitted++;
          }
          values[i2] = value;
        },
        error: function(err) {
          return subscriber.error(err);
        },
        complete: function() {
          completed++;
          if (completed === len || !hasValue) {
            if (emitted === len) {
              subscriber.next(keys ? keys.reduce(function(result, key, i3) {
                return result[key] = values[i3], result;
              }, {}) : values);
            }
            subscriber.complete();
          }
        }
      }));
    };
    for (var i = 0; i < len; i++) {
      _loop_1(i);
    }
  });
}
var init_forkJoin = __esm({
  "node_modules/rxjs/_esm5/internal/observable/forkJoin.js"() {
    init_Observable();
    init_isArray();
    init_map();
    init_isObject();
    init_from();
  }
});

// node_modules/rxjs/_esm5/internal/observable/fromEvent.js
function fromEvent(target, eventName, options, resultSelector) {
  if (isFunction(options)) {
    resultSelector = options;
    options = void 0;
  }
  if (resultSelector) {
    return fromEvent(target, eventName, options).pipe(map(function(args) {
      return isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args);
    }));
  }
  return new Observable(function(subscriber) {
    function handler(e) {
      if (arguments.length > 1) {
        subscriber.next(Array.prototype.slice.call(arguments));
      } else {
        subscriber.next(e);
      }
    }
    setupSubscription(target, eventName, handler, subscriber, options);
  });
}
function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
  var unsubscribe;
  if (isEventTarget(sourceObj)) {
    var source_1 = sourceObj;
    sourceObj.addEventListener(eventName, handler, options);
    unsubscribe = function() {
      return source_1.removeEventListener(eventName, handler, options);
    };
  } else if (isJQueryStyleEventEmitter(sourceObj)) {
    var source_2 = sourceObj;
    sourceObj.on(eventName, handler);
    unsubscribe = function() {
      return source_2.off(eventName, handler);
    };
  } else if (isNodeStyleEventEmitter(sourceObj)) {
    var source_3 = sourceObj;
    sourceObj.addListener(eventName, handler);
    unsubscribe = function() {
      return source_3.removeListener(eventName, handler);
    };
  } else if (sourceObj && sourceObj.length) {
    for (var i = 0, len = sourceObj.length; i < len; i++) {
      setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
    }
  } else {
    throw new TypeError("Invalid event target");
  }
  subscriber.add(unsubscribe);
}
function isNodeStyleEventEmitter(sourceObj) {
  return sourceObj && typeof sourceObj.addListener === "function" && typeof sourceObj.removeListener === "function";
}
function isJQueryStyleEventEmitter(sourceObj) {
  return sourceObj && typeof sourceObj.on === "function" && typeof sourceObj.off === "function";
}
function isEventTarget(sourceObj) {
  return sourceObj && typeof sourceObj.addEventListener === "function" && typeof sourceObj.removeEventListener === "function";
}
var toString;
var init_fromEvent = __esm({
  "node_modules/rxjs/_esm5/internal/observable/fromEvent.js"() {
    init_Observable();
    init_isArray();
    init_isFunction();
    init_map();
    toString = function() {
      return Object.prototype.toString;
    }();
  }
});

// node_modules/rxjs/_esm5/internal/observable/fromEventPattern.js
function fromEventPattern(addHandler, removeHandler, resultSelector) {
  if (resultSelector) {
    return fromEventPattern(addHandler, removeHandler).pipe(map(function(args) {
      return isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args);
    }));
  }
  return new Observable(function(subscriber) {
    var handler = function() {
      var e = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        e[_i] = arguments[_i];
      }
      return subscriber.next(e.length === 1 ? e[0] : e);
    };
    var retValue;
    try {
      retValue = addHandler(handler);
    } catch (err) {
      subscriber.error(err);
      return void 0;
    }
    if (!isFunction(removeHandler)) {
      return void 0;
    }
    return function() {
      return removeHandler(handler, retValue);
    };
  });
}
var init_fromEventPattern = __esm({
  "node_modules/rxjs/_esm5/internal/observable/fromEventPattern.js"() {
    init_Observable();
    init_isArray();
    init_isFunction();
    init_map();
  }
});

// node_modules/rxjs/_esm5/internal/observable/generate.js
function generate(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
  var resultSelector;
  var initialState;
  if (arguments.length == 1) {
    var options = initialStateOrOptions;
    initialState = options.initialState;
    condition = options.condition;
    iterate = options.iterate;
    resultSelector = options.resultSelector || identity;
    scheduler = options.scheduler;
  } else if (resultSelectorOrObservable === void 0 || isScheduler(resultSelectorOrObservable)) {
    initialState = initialStateOrOptions;
    resultSelector = identity;
    scheduler = resultSelectorOrObservable;
  } else {
    initialState = initialStateOrOptions;
    resultSelector = resultSelectorOrObservable;
  }
  return new Observable(function(subscriber) {
    var state = initialState;
    if (scheduler) {
      return scheduler.schedule(dispatch3, 0, {
        subscriber,
        iterate,
        condition,
        resultSelector,
        state
      });
    }
    do {
      if (condition) {
        var conditionResult = void 0;
        try {
          conditionResult = condition(state);
        } catch (err) {
          subscriber.error(err);
          return void 0;
        }
        if (!conditionResult) {
          subscriber.complete();
          break;
        }
      }
      var value = void 0;
      try {
        value = resultSelector(state);
      } catch (err) {
        subscriber.error(err);
        return void 0;
      }
      subscriber.next(value);
      if (subscriber.closed) {
        break;
      }
      try {
        state = iterate(state);
      } catch (err) {
        subscriber.error(err);
        return void 0;
      }
    } while (true);
    return void 0;
  });
}
function dispatch3(state) {
  var subscriber = state.subscriber, condition = state.condition;
  if (subscriber.closed) {
    return void 0;
  }
  if (state.needIterate) {
    try {
      state.state = state.iterate(state.state);
    } catch (err) {
      subscriber.error(err);
      return void 0;
    }
  } else {
    state.needIterate = true;
  }
  if (condition) {
    var conditionResult = void 0;
    try {
      conditionResult = condition(state.state);
    } catch (err) {
      subscriber.error(err);
      return void 0;
    }
    if (!conditionResult) {
      subscriber.complete();
      return void 0;
    }
    if (subscriber.closed) {
      return void 0;
    }
  }
  var value;
  try {
    value = state.resultSelector(state.state);
  } catch (err) {
    subscriber.error(err);
    return void 0;
  }
  if (subscriber.closed) {
    return void 0;
  }
  subscriber.next(value);
  if (subscriber.closed) {
    return void 0;
  }
  return this.schedule(state);
}
var init_generate = __esm({
  "node_modules/rxjs/_esm5/internal/observable/generate.js"() {
    init_Observable();
    init_identity();
    init_isScheduler();
  }
});

// node_modules/rxjs/_esm5/internal/observable/iif.js
function iif(condition, trueResult, falseResult) {
  if (trueResult === void 0) {
    trueResult = EMPTY;
  }
  if (falseResult === void 0) {
    falseResult = EMPTY;
  }
  return defer(function() {
    return condition() ? trueResult : falseResult;
  });
}
var init_iif = __esm({
  "node_modules/rxjs/_esm5/internal/observable/iif.js"() {
    init_defer();
    init_empty();
  }
});

// node_modules/rxjs/_esm5/internal/observable/interval.js
function interval(period, scheduler) {
  if (period === void 0) {
    period = 0;
  }
  if (scheduler === void 0) {
    scheduler = async;
  }
  if (!isNumeric(period) || period < 0) {
    period = 0;
  }
  if (!scheduler || typeof scheduler.schedule !== "function") {
    scheduler = async;
  }
  return new Observable(function(subscriber) {
    subscriber.add(scheduler.schedule(dispatch4, period, { subscriber, counter: 0, period }));
    return subscriber;
  });
}
function dispatch4(state) {
  var subscriber = state.subscriber, counter = state.counter, period = state.period;
  subscriber.next(counter);
  this.schedule({ subscriber, counter: counter + 1, period }, period);
}
var init_interval = __esm({
  "node_modules/rxjs/_esm5/internal/observable/interval.js"() {
    init_Observable();
    init_async();
    init_isNumeric();
  }
});

// node_modules/rxjs/_esm5/internal/observable/never.js
function never() {
  return NEVER;
}
var NEVER;
var init_never = __esm({
  "node_modules/rxjs/_esm5/internal/observable/never.js"() {
    init_Observable();
    init_noop();
    NEVER = new Observable(noop);
  }
});

// node_modules/rxjs/_esm5/internal/observable/onErrorResumeNext.js
function onErrorResumeNext() {
  var sources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }
  if (sources.length === 0) {
    return EMPTY;
  }
  var first = sources[0], remainder = sources.slice(1);
  if (sources.length === 1 && isArray(first)) {
    return onErrorResumeNext.apply(void 0, first);
  }
  return new Observable(function(subscriber) {
    var subNext = function() {
      return subscriber.add(onErrorResumeNext.apply(void 0, remainder).subscribe(subscriber));
    };
    return from(first).subscribe({
      next: function(value) {
        subscriber.next(value);
      },
      error: subNext,
      complete: subNext
    });
  });
}
var init_onErrorResumeNext = __esm({
  "node_modules/rxjs/_esm5/internal/observable/onErrorResumeNext.js"() {
    init_Observable();
    init_from();
    init_isArray();
    init_empty();
  }
});

// node_modules/rxjs/_esm5/internal/observable/pairs.js
function pairs(obj, scheduler) {
  if (!scheduler) {
    return new Observable(function(subscriber) {
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length && !subscriber.closed; i++) {
        var key = keys[i];
        if (obj.hasOwnProperty(key)) {
          subscriber.next([key, obj[key]]);
        }
      }
      subscriber.complete();
    });
  } else {
    return new Observable(function(subscriber) {
      var keys = Object.keys(obj);
      var subscription = new Subscription();
      subscription.add(scheduler.schedule(dispatch5, 0, { keys, index: 0, subscriber, subscription, obj }));
      return subscription;
    });
  }
}
function dispatch5(state) {
  var keys = state.keys, index = state.index, subscriber = state.subscriber, subscription = state.subscription, obj = state.obj;
  if (!subscriber.closed) {
    if (index < keys.length) {
      var key = keys[index];
      subscriber.next([key, obj[key]]);
      subscription.add(this.schedule({ keys, index: index + 1, subscriber, subscription, obj }));
    } else {
      subscriber.complete();
    }
  }
}
var init_pairs = __esm({
  "node_modules/rxjs/_esm5/internal/observable/pairs.js"() {
    init_Observable();
    init_Subscription();
  }
});

// node_modules/rxjs/_esm5/internal/observable/partition.js
function partition(source, predicate, thisArg) {
  return [
    filter(predicate, thisArg)(new Observable(subscribeTo(source))),
    filter(not(predicate, thisArg))(new Observable(subscribeTo(source)))
  ];
}
var init_partition = __esm({
  "node_modules/rxjs/_esm5/internal/observable/partition.js"() {
    init_not();
    init_subscribeTo();
    init_filter();
    init_Observable();
  }
});

// node_modules/rxjs/_esm5/internal/observable/range.js
function range(start, count, scheduler) {
  if (start === void 0) {
    start = 0;
  }
  return new Observable(function(subscriber) {
    if (count === void 0) {
      count = start;
      start = 0;
    }
    var index = 0;
    var current = start;
    if (scheduler) {
      return scheduler.schedule(dispatch6, 0, {
        index,
        count,
        start,
        subscriber
      });
    } else {
      do {
        if (index++ >= count) {
          subscriber.complete();
          break;
        }
        subscriber.next(current++);
        if (subscriber.closed) {
          break;
        }
      } while (true);
    }
    return void 0;
  });
}
function dispatch6(state) {
  var start = state.start, index = state.index, count = state.count, subscriber = state.subscriber;
  if (index >= count) {
    subscriber.complete();
    return;
  }
  subscriber.next(start);
  if (subscriber.closed) {
    return;
  }
  state.index = index + 1;
  state.start = start + 1;
  this.schedule(state);
}
var init_range = __esm({
  "node_modules/rxjs/_esm5/internal/observable/range.js"() {
    init_Observable();
  }
});

// node_modules/rxjs/_esm5/internal/observable/using.js
function using(resourceFactory, observableFactory) {
  return new Observable(function(subscriber) {
    var resource;
    try {
      resource = resourceFactory();
    } catch (err) {
      subscriber.error(err);
      return void 0;
    }
    var result;
    try {
      result = observableFactory(resource);
    } catch (err) {
      subscriber.error(err);
      return void 0;
    }
    var source = result ? from(result) : EMPTY;
    var subscription = source.subscribe(subscriber);
    return function() {
      subscription.unsubscribe();
      if (resource) {
        resource.unsubscribe();
      }
    };
  });
}
var init_using = __esm({
  "node_modules/rxjs/_esm5/internal/observable/using.js"() {
    init_Observable();
    init_from();
    init_empty();
  }
});

// node_modules/rxjs/_esm5/index.js
var esm5_exports = {};
__export(esm5_exports, {
  ArgumentOutOfRangeError: () => ArgumentOutOfRangeError,
  AsyncSubject: () => AsyncSubject,
  BehaviorSubject: () => BehaviorSubject,
  ConnectableObservable: () => ConnectableObservable,
  EMPTY: () => EMPTY,
  EmptyError: () => EmptyError,
  GroupedObservable: () => GroupedObservable,
  NEVER: () => NEVER,
  Notification: () => Notification,
  NotificationKind: () => NotificationKind,
  ObjectUnsubscribedError: () => ObjectUnsubscribedError,
  Observable: () => Observable,
  ReplaySubject: () => ReplaySubject,
  Scheduler: () => Scheduler,
  Subject: () => Subject,
  Subscriber: () => Subscriber,
  Subscription: () => Subscription,
  TimeoutError: () => TimeoutError,
  UnsubscriptionError: () => UnsubscriptionError,
  VirtualAction: () => VirtualAction,
  VirtualTimeScheduler: () => VirtualTimeScheduler,
  animationFrame: () => animationFrame,
  animationFrameScheduler: () => animationFrameScheduler,
  asap: () => asap,
  asapScheduler: () => asapScheduler,
  async: () => async,
  asyncScheduler: () => asyncScheduler,
  bindCallback: () => bindCallback,
  bindNodeCallback: () => bindNodeCallback,
  combineLatest: () => combineLatest,
  concat: () => concat,
  config: () => config,
  defer: () => defer,
  empty: () => empty,
  forkJoin: () => forkJoin,
  from: () => from,
  fromEvent: () => fromEvent,
  fromEventPattern: () => fromEventPattern,
  generate: () => generate,
  identity: () => identity,
  iif: () => iif,
  interval: () => interval,
  isObservable: () => isObservable,
  merge: () => merge,
  never: () => never,
  noop: () => noop,
  observable: () => observable,
  of: () => of,
  onErrorResumeNext: () => onErrorResumeNext,
  pairs: () => pairs,
  partition: () => partition,
  pipe: () => pipe,
  queue: () => queue,
  queueScheduler: () => queueScheduler,
  race: () => race,
  range: () => range,
  scheduled: () => scheduled,
  throwError: () => throwError,
  timer: () => timer,
  using: () => using,
  zip: () => zip
});
var init_esm5 = __esm({
  "node_modules/rxjs/_esm5/index.js"() {
    init_Observable();
    init_ConnectableObservable();
    init_groupBy();
    init_observable();
    init_Subject();
    init_BehaviorSubject();
    init_ReplaySubject();
    init_AsyncSubject();
    init_asap();
    init_async();
    init_queue();
    init_animationFrame();
    init_VirtualTimeScheduler();
    init_Scheduler();
    init_Subscription();
    init_Subscriber();
    init_Notification();
    init_pipe();
    init_noop();
    init_identity();
    init_isObservable();
    init_ArgumentOutOfRangeError();
    init_EmptyError();
    init_ObjectUnsubscribedError();
    init_UnsubscriptionError();
    init_TimeoutError();
    init_bindCallback();
    init_bindNodeCallback();
    init_combineLatest();
    init_concat();
    init_defer();
    init_empty();
    init_forkJoin();
    init_from();
    init_fromEvent();
    init_fromEventPattern();
    init_generate();
    init_iif();
    init_interval();
    init_merge();
    init_never();
    init_of();
    init_onErrorResumeNext();
    init_pairs();
    init_partition();
    init_race();
    init_range();
    init_throwError();
    init_timer();
    init_using();
    init_zip();
    init_scheduled();
    init_empty();
    init_never();
    init_config();
  }
});

export {
  animationFrameScheduler,
  animationFrame,
  VirtualTimeScheduler,
  VirtualAction,
  isObservable,
  bindCallback,
  bindNodeCallback,
  forkJoin,
  fromEvent,
  fromEventPattern,
  generate,
  iif,
  interval,
  NEVER,
  never,
  onErrorResumeNext,
  pairs,
  partition,
  range,
  using,
  esm5_exports,
  init_esm5
};
//# sourceMappingURL=chunk-XJMXRHCD.js.map
