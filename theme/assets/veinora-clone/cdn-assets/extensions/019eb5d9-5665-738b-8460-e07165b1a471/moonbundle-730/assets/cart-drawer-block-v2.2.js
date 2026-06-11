var MoonbundleCartDrawer = function() {
  "use strict";
  const DEV = false;
  var is_array = Array.isArray;
  var index_of = Array.prototype.indexOf;
  var array_from = Array.from;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
  var get_descriptors = Object.getOwnPropertyDescriptors;
  var object_prototype = Object.prototype;
  var array_prototype = Array.prototype;
  var get_prototype_of = Object.getPrototypeOf;
  var is_extensible = Object.isExtensible;
  function run_all(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i]();
    }
  }
  function deferred() {
    var resolve;
    var reject;
    var promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }
  function to_array(value, n) {
    if (Array.isArray(value)) {
      return value;
    }
    if (!(Symbol.iterator in value)) {
      return Array.from(value);
    }
    const array = [];
    for (const element of value) {
      array.push(element);
      if (array.length === n) break;
    }
    return array;
  }
  const DERIVED = 1 << 1;
  const EFFECT = 1 << 2;
  const RENDER_EFFECT = 1 << 3;
  const BLOCK_EFFECT = 1 << 4;
  const BRANCH_EFFECT = 1 << 5;
  const ROOT_EFFECT = 1 << 6;
  const BOUNDARY_EFFECT = 1 << 7;
  const UNOWNED = 1 << 8;
  const DISCONNECTED = 1 << 9;
  const CLEAN = 1 << 10;
  const DIRTY = 1 << 11;
  const MAYBE_DIRTY = 1 << 12;
  const INERT = 1 << 13;
  const DESTROYED = 1 << 14;
  const EFFECT_RAN = 1 << 15;
  const EFFECT_TRANSPARENT = 1 << 16;
  const INSPECT_EFFECT = 1 << 17;
  const HEAD_EFFECT = 1 << 18;
  const EFFECT_PRESERVED = 1 << 19;
  const USER_EFFECT = 1 << 20;
  const REACTION_IS_UPDATING = 1 << 21;
  const ASYNC = 1 << 22;
  const ERROR_VALUE = 1 << 23;
  const STATE_SYMBOL = Symbol("$state");
  const LEGACY_PROPS = Symbol("legacy props");
  const LOADING_ATTR_SYMBOL = Symbol("");
  const STALE_REACTION = new class StaleReactionError extends Error {
    name = "StaleReactionError";
    message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
  }();
  function await_outside_boundary() {
    {
      throw new Error(`https://svelte.dev/e/await_outside_boundary`);
    }
  }
  function lifecycle_outside_component(name) {
    {
      throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
    }
  }
  function async_derived_orphan() {
    {
      throw new Error(`https://svelte.dev/e/async_derived_orphan`);
    }
  }
  function effect_in_teardown(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_in_teardown`);
    }
  }
  function effect_in_unowned_derived() {
    {
      throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
    }
  }
  function effect_orphan(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_orphan`);
    }
  }
  function effect_update_depth_exceeded() {
    {
      throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
    }
  }
  function props_invalid_value(key2) {
    {
      throw new Error(`https://svelte.dev/e/props_invalid_value`);
    }
  }
  function state_descriptors_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
    }
  }
  function state_prototype_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
    }
  }
  function state_unsafe_mutation() {
    {
      throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
    }
  }
  const EACH_ITEM_REACTIVE = 1;
  const EACH_INDEX_REACTIVE = 1 << 1;
  const EACH_IS_CONTROLLED = 1 << 2;
  const EACH_IS_ANIMATED = 1 << 3;
  const EACH_ITEM_IMMUTABLE = 1 << 4;
  const PROPS_IS_IMMUTABLE = 1;
  const PROPS_IS_UPDATED = 1 << 2;
  const PROPS_IS_BINDABLE = 1 << 3;
  const PROPS_IS_LAZY_INITIAL = 1 << 4;
  const TEMPLATE_FRAGMENT = 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const UNINITIALIZED = Symbol();
  const NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
  let hydrating = false;
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
  }
  function not_equal(a, b) {
    return a !== b;
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }
  let tracing_mode_flag = false;
  let component_context = null;
  function set_component_context(context) {
    component_context = context;
  }
  function getContext(key2) {
    const context_map = get_or_init_context_map();
    const result = (
      /** @type {T} */
      context_map.get(key2)
    );
    return result;
  }
  function setContext(key2, context) {
    const context_map = get_or_init_context_map();
    context_map.set(key2, context);
    return context;
  }
  function push(props, runes = false, fn) {
    component_context = {
      p: component_context,
      c: null,
      e: null,
      s: props,
      x: null,
      l: null
    };
  }
  function pop(component) {
    var context = (
      /** @type {ComponentContext} */
      component_context
    );
    var effects = context.e;
    if (effects !== null) {
      context.e = null;
      for (var fn of effects) {
        create_user_effect(fn);
      }
    }
    if (component !== void 0) {
      context.x = component;
    }
    component_context = context.p;
    return component ?? /** @type {T} */
    {};
  }
  function is_runes() {
    return true;
  }
  function get_or_init_context_map(name) {
    if (component_context === null) {
      lifecycle_outside_component();
    }
    return component_context.c ??= new Map(get_parent_context(component_context) || void 0);
  }
  function get_parent_context(component_context2) {
    let parent = component_context2.p;
    while (parent !== null) {
      const context_map = parent.c;
      if (context_map !== null) {
        return context_map;
      }
      parent = parent.p;
    }
    return null;
  }
  const adjustments = /* @__PURE__ */ new WeakMap();
  function handle_error(error) {
    var effect2 = active_effect;
    if (effect2 === null) {
      active_reaction.f |= ERROR_VALUE;
      return error;
    }
    if ((effect2.f & EFFECT_RAN) === 0) {
      if ((effect2.f & BOUNDARY_EFFECT) === 0) {
        if (!effect2.parent && error instanceof Error) {
          apply_adjustments(error);
        }
        throw error;
      }
      effect2.b.error(error);
    } else {
      invoke_error_boundary(error, effect2);
    }
  }
  function invoke_error_boundary(error, effect2) {
    while (effect2 !== null) {
      if ((effect2.f & BOUNDARY_EFFECT) !== 0) {
        try {
          effect2.b.error(error);
          return;
        } catch (e) {
          error = e;
        }
      }
      effect2 = effect2.parent;
    }
    if (error instanceof Error) {
      apply_adjustments(error);
    }
    throw error;
  }
  function apply_adjustments(error) {
    const adjusted = adjustments.get(error);
    if (adjusted) {
      define_property(error, "message", {
        value: adjusted.message
      });
      define_property(error, "stack", {
        value: adjusted.stack
      });
    }
  }
  let micro_tasks = [];
  function run_micro_tasks() {
    var tasks2 = micro_tasks;
    micro_tasks = [];
    run_all(tasks2);
  }
  function queue_micro_task(fn) {
    if (micro_tasks.length === 0) {
      queueMicrotask(run_micro_tasks);
    }
    micro_tasks.push(fn);
  }
  function get_pending_boundary() {
    var boundary = (
      /** @type {Effect} */
      active_effect.b
    );
    while (boundary !== null && !boundary.has_pending_snippet()) {
      boundary = boundary.parent;
    }
    if (boundary === null) {
      await_outside_boundary();
    }
    return boundary;
  }
  // @__NO_SIDE_EFFECTS__
  function derived(fn) {
    var flags = DERIVED | DIRTY;
    var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? (
      /** @type {Derived} */
      active_reaction
    ) : null;
    if (active_effect === null || parent_derived !== null && (parent_derived.f & UNOWNED) !== 0) {
      flags |= UNOWNED;
    } else {
      active_effect.f |= EFFECT_PRESERVED;
    }
    const signal = {
      ctx: component_context,
      deps: null,
      effects: null,
      equals,
      f: flags,
      fn,
      reactions: null,
      rv: 0,
      v: (
        /** @type {V} */
        UNINITIALIZED
      ),
      wv: 0,
      parent: parent_derived ?? active_effect,
      ac: null
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function async_derived(fn, location) {
    let parent = (
      /** @type {Effect | null} */
      active_effect
    );
    if (parent === null) {
      async_derived_orphan();
    }
    var boundary = (
      /** @type {Boundary} */
      parent.b
    );
    var promise = (
      /** @type {Promise<V>} */
      /** @type {unknown} */
      void 0
    );
    var signal = source(
      /** @type {V} */
      UNINITIALIZED
    );
    var prev = null;
    var should_suspend = !active_reaction;
    async_effect(() => {
      try {
        var p = fn();
      } catch (error) {
        p = Promise.reject(error);
      }
      var r = () => p;
      promise = prev?.then(r, r) ?? Promise.resolve(p);
      prev = promise;
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      var pending = boundary.pending;
      if (should_suspend) {
        boundary.update_pending_count(1);
        if (!pending) batch.increment();
      }
      const handler = (value, error = void 0) => {
        prev = null;
        if (!pending) batch.activate();
        if (error) {
          if (error !== STALE_REACTION) {
            signal.f |= ERROR_VALUE;
            internal_set(signal, error);
          }
        } else {
          if ((signal.f & ERROR_VALUE) !== 0) {
            signal.f ^= ERROR_VALUE;
          }
          internal_set(signal, value);
        }
        if (should_suspend) {
          boundary.update_pending_count(-1);
          if (!pending) batch.decrement();
        }
        unset_context();
      };
      promise.then(handler, (e) => handler(null, e || "unknown"));
      if (batch) {
        return () => {
          queueMicrotask(() => batch.neuter());
        };
      }
    });
    return new Promise((fulfil) => {
      function next(p) {
        function go() {
          if (p === promise) {
            fulfil(signal);
          } else {
            next(promise);
          }
        }
        p.then(go, go);
      }
      next(promise);
    });
  }
  // @__NO_SIDE_EFFECTS__
  function user_derived(fn) {
    const d = /* @__PURE__ */ derived(fn);
    push_reaction_value(d);
    return d;
  }
  // @__NO_SIDE_EFFECTS__
  function derived_safe_equal(fn) {
    const signal = /* @__PURE__ */ derived(fn);
    signal.equals = safe_equals;
    return signal;
  }
  function destroy_derived_effects(derived2) {
    var effects = derived2.effects;
    if (effects !== null) {
      derived2.effects = null;
      for (var i = 0; i < effects.length; i += 1) {
        destroy_effect(
          /** @type {Effect} */
          effects[i]
        );
      }
    }
  }
  function get_derived_parent_effect(derived2) {
    var parent = derived2.parent;
    while (parent !== null) {
      if ((parent.f & DERIVED) === 0) {
        return (
          /** @type {Effect} */
          parent
        );
      }
      parent = parent.parent;
    }
    return null;
  }
  function execute_derived(derived2) {
    var value;
    var prev_active_effect = active_effect;
    set_active_effect(get_derived_parent_effect(derived2));
    {
      try {
        destroy_derived_effects(derived2);
        value = update_reaction(derived2);
      } finally {
        set_active_effect(prev_active_effect);
      }
    }
    return value;
  }
  function update_derived(derived2) {
    var value = execute_derived(derived2);
    if (!derived2.equals(value)) {
      derived2.v = value;
      derived2.wv = increment_write_version();
    }
    if (is_destroying_effect) {
      return;
    }
    if (batch_deriveds !== null) {
      batch_deriveds.set(derived2, derived2.v);
    } else {
      var status = (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
      set_signal_status(derived2, status);
    }
  }
  function flatten(sync, async, fn) {
    const d = derived;
    if (async.length === 0) {
      fn(sync.map(d));
      return;
    }
    var batch = current_batch;
    var parent = (
      /** @type {Effect} */
      active_effect
    );
    var restore = capture();
    var boundary = get_pending_boundary();
    Promise.all(async.map((expression) => /* @__PURE__ */ async_derived(expression))).then((result) => {
      batch?.activate();
      restore();
      try {
        fn([...sync.map(d), ...result]);
      } catch (error) {
        if ((parent.f & DESTROYED) === 0) {
          invoke_error_boundary(error, parent);
        }
      }
      batch?.deactivate();
      unset_context();
    }).catch((error) => {
      boundary.error(error);
    });
  }
  function capture() {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_component_context = component_context;
    return function restore() {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_component_context);
    };
  }
  function unset_context() {
    set_active_effect(null);
    set_active_reaction(null);
    set_component_context(null);
  }
  const batches = /* @__PURE__ */ new Set();
  let current_batch = null;
  let previous_batch = null;
  let batch_deriveds = null;
  let effect_pending_updates = /* @__PURE__ */ new Set();
  let tasks = [];
  function dequeue() {
    const task = (
      /** @type {() => void} */
      tasks.shift()
    );
    if (tasks.length > 0) {
      queueMicrotask(dequeue);
    }
    task();
  }
  let queued_root_effects = [];
  let last_scheduled_effect = null;
  let is_flushing = false;
  class Batch {
    /**
     * The current values of any sources that are updated in this batch
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Source, any>}
     */
    current = /* @__PURE__ */ new Map();
    /**
     * The values of any sources that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Source, any>}
     */
    #previous = /* @__PURE__ */ new Map();
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<() => void>}
     */
    #callbacks = /* @__PURE__ */ new Set();
    /**
     * The number of async effects that are currently in flight
     */
    #pending = 0;
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    #deferred = null;
    /**
     * True if an async effect inside this batch resolved and
     * its parent branch was already deleted
     */
    #neutered = false;
    /**
     * Async effects (created inside `async_derived`) encountered during processing.
     * These run after the rest of the batch has updated, since they should
     * always have the latest values
     * @type {Effect[]}
     */
    #async_effects = [];
    /**
     * The same as `#async_effects`, but for effects inside a newly-created
     * `<svelte:boundary>` — these do not prevent the batch from committing
     * @type {Effect[]}
     */
    #boundary_async_effects = [];
    /**
     * Template effects and `$effect.pre` effects, which run when
     * a batch is committed
     * @type {Effect[]}
     */
    #render_effects = [];
    /**
     * The same as `#render_effects`, but for `$effect` (which runs after)
     * @type {Effect[]}
     */
    #effects = [];
    /**
     * Block effects, which may need to re-run on subsequent flushes
     * in order to update internal sources (e.g. each block items)
     * @type {Effect[]}
     */
    #block_effects = [];
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Effect[]}
     */
    #dirty_effects = [];
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Effect[]}
     */
    #maybe_dirty_effects = [];
    /**
     * A set of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`
     * @type {Set<Effect>}
     */
    skipped_effects = /* @__PURE__ */ new Set();
    /**
     *
     * @param {Effect[]} root_effects
     */
    process(root_effects) {
      queued_root_effects = [];
      previous_batch = null;
      var current_values = null;
      if (batches.size > 1) {
        current_values = /* @__PURE__ */ new Map();
        batch_deriveds = /* @__PURE__ */ new Map();
        for (const [source2, current] of this.current) {
          current_values.set(source2, { v: source2.v, wv: source2.wv });
          source2.v = current;
        }
        for (const batch of batches) {
          if (batch === this) continue;
          for (const [source2, previous] of batch.#previous) {
            if (!current_values.has(source2)) {
              current_values.set(source2, { v: source2.v, wv: source2.wv });
              source2.v = previous;
            }
          }
        }
      }
      for (const root2 of root_effects) {
        this.#traverse_effect_tree(root2);
      }
      if (this.#async_effects.length === 0 && this.#pending === 0) {
        this.#commit();
        var render_effects = this.#render_effects;
        var effects = this.#effects;
        this.#render_effects = [];
        this.#effects = [];
        this.#block_effects = [];
        previous_batch = current_batch;
        current_batch = null;
        flush_queued_effects(render_effects);
        flush_queued_effects(effects);
        if (current_batch === null) {
          current_batch = this;
        } else {
          batches.delete(this);
        }
        this.#deferred?.resolve();
      } else {
        this.#defer_effects(this.#render_effects);
        this.#defer_effects(this.#effects);
        this.#defer_effects(this.#block_effects);
      }
      if (current_values) {
        for (const [source2, { v, wv }] of current_values) {
          if (source2.wv <= wv) {
            source2.v = v;
          }
        }
        batch_deriveds = null;
      }
      for (const effect2 of this.#async_effects) {
        update_effect(effect2);
      }
      for (const effect2 of this.#boundary_async_effects) {
        update_effect(effect2);
      }
      this.#async_effects = [];
      this.#boundary_async_effects = [];
    }
    /**
     * Traverse the effect tree, executing effects or stashing
     * them for later execution as appropriate
     * @param {Effect} root
     */
    #traverse_effect_tree(root2) {
      root2.f ^= CLEAN;
      var effect2 = root2.first;
      while (effect2 !== null) {
        var flags = effect2.f;
        var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
        var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
        var skip = is_skippable_branch || (flags & INERT) !== 0 || this.skipped_effects.has(effect2);
        if (!skip && effect2.fn !== null) {
          if (is_branch) {
            effect2.f ^= CLEAN;
          } else if ((flags & CLEAN) === 0) {
            if ((flags & EFFECT) !== 0) {
              this.#effects.push(effect2);
            } else if ((flags & ASYNC) !== 0) {
              var effects = effect2.b?.pending ? this.#boundary_async_effects : this.#async_effects;
              effects.push(effect2);
            } else if (is_dirty(effect2)) {
              if ((effect2.f & BLOCK_EFFECT) !== 0) this.#block_effects.push(effect2);
              update_effect(effect2);
            }
          }
          var child2 = effect2.first;
          if (child2 !== null) {
            effect2 = child2;
            continue;
          }
        }
        var parent = effect2.parent;
        effect2 = effect2.next;
        while (effect2 === null && parent !== null) {
          effect2 = parent.next;
          parent = parent.parent;
        }
      }
    }
    /**
     * @param {Effect[]} effects
     */
    #defer_effects(effects) {
      for (const e of effects) {
        const target = (e.f & DIRTY) !== 0 ? this.#dirty_effects : this.#maybe_dirty_effects;
        target.push(e);
        set_signal_status(e, CLEAN);
      }
      effects.length = 0;
    }
    /**
     * Associate a change to a given source with the current
     * batch, noting its previous and current values
     * @param {Source} source
     * @param {any} value
     */
    capture(source2, value) {
      if (!this.#previous.has(source2)) {
        this.#previous.set(source2, value);
      }
      this.current.set(source2, source2.v);
    }
    activate() {
      current_batch = this;
    }
    deactivate() {
      current_batch = null;
      previous_batch = null;
      for (const update2 of effect_pending_updates) {
        effect_pending_updates.delete(update2);
        update2();
        if (current_batch !== null) {
          break;
        }
      }
    }
    neuter() {
      this.#neutered = true;
    }
    flush() {
      if (queued_root_effects.length > 0) {
        flush_effects();
      } else {
        this.#commit();
      }
      if (current_batch !== this) {
        return;
      }
      if (this.#pending === 0) {
        batches.delete(this);
      }
      this.deactivate();
    }
    /**
     * Append and remove branches to/from the DOM
     */
    #commit() {
      if (!this.#neutered) {
        for (const fn of this.#callbacks) {
          fn();
        }
      }
      this.#callbacks.clear();
    }
    increment() {
      this.#pending += 1;
    }
    decrement() {
      this.#pending -= 1;
      if (this.#pending === 0) {
        for (const e of this.#dirty_effects) {
          set_signal_status(e, DIRTY);
          schedule_effect(e);
        }
        for (const e of this.#maybe_dirty_effects) {
          set_signal_status(e, MAYBE_DIRTY);
          schedule_effect(e);
        }
        this.#render_effects = [];
        this.#effects = [];
        this.flush();
      } else {
        this.deactivate();
      }
    }
    /** @param {() => void} fn */
    add_callback(fn) {
      this.#callbacks.add(fn);
    }
    settled() {
      return (this.#deferred ??= deferred()).promise;
    }
    static ensure() {
      if (current_batch === null) {
        const batch = current_batch = new Batch();
        batches.add(current_batch);
        {
          Batch.enqueue(() => {
            if (current_batch !== batch) {
              return;
            }
            batch.flush();
          });
        }
      }
      return current_batch;
    }
    /** @param {() => void} task */
    static enqueue(task) {
      if (tasks.length === 0) {
        queueMicrotask(dequeue);
      }
      tasks.unshift(task);
    }
  }
  function flush_effects() {
    var was_updating_effect = is_updating_effect;
    is_flushing = true;
    try {
      var flush_count = 0;
      set_is_updating_effect(true);
      while (queued_root_effects.length > 0) {
        var batch = Batch.ensure();
        if (flush_count++ > 1e3) {
          var updates, entry;
          if (DEV) ;
          infinite_loop_guard();
        }
        batch.process(queued_root_effects);
        old_values.clear();
      }
    } finally {
      is_flushing = false;
      set_is_updating_effect(was_updating_effect);
      last_scheduled_effect = null;
    }
  }
  function infinite_loop_guard() {
    try {
      effect_update_depth_exceeded();
    } catch (error) {
      invoke_error_boundary(error, last_scheduled_effect);
    }
  }
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    var i = 0;
    while (i < length) {
      var effect2 = effects[i++];
      if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
        var n = current_batch ? current_batch.current.size : 0;
        update_effect(effect2);
        if (effect2.deps === null && effect2.first === null && effect2.nodes_start === null) {
          if (effect2.teardown === null && effect2.ac === null) {
            unlink_effect(effect2);
          } else {
            effect2.fn = null;
          }
        }
        if (current_batch !== null && current_batch.current.size > n && (effect2.f & USER_EFFECT) !== 0) {
          break;
        }
      }
    }
    while (i < length) {
      schedule_effect(effects[i++]);
    }
  }
  function schedule_effect(signal) {
    var effect2 = last_scheduled_effect = signal;
    while (effect2.parent !== null) {
      effect2 = effect2.parent;
      var flags = effect2.f;
      if (is_flushing && effect2 === active_effect && (flags & BLOCK_EFFECT) !== 0) {
        return;
      }
      if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags & CLEAN) === 0) return;
        effect2.f ^= CLEAN;
      }
    }
    queued_root_effects.push(effect2);
  }
  const old_values = /* @__PURE__ */ new Map();
  function source(v, stack) {
    var signal = {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v,
      reactions: null,
      equals,
      rv: 0,
      wv: 0
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function state(v, stack) {
    const s = source(v);
    push_reaction_value(s);
    return s;
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value, immutable = false, trackable = true) {
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    return s;
  }
  function set(source2, value, should_proxy = false) {
    if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
    // to ensure we error if state is set inside an inspect effect
    (!untracking || (active_reaction.f & INSPECT_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | INSPECT_EFFECT)) !== 0 && !current_sources?.includes(source2)) {
      state_unsafe_mutation();
    }
    let new_value = should_proxy ? proxy(value) : value;
    return internal_set(source2, new_value);
  }
  function internal_set(source2, value) {
    if (!source2.equals(value)) {
      var old_value = source2.v;
      if (is_destroying_effect) {
        old_values.set(source2, value);
      } else {
        old_values.set(source2, old_value);
      }
      source2.v = value;
      var batch = Batch.ensure();
      batch.capture(source2, old_value);
      if ((source2.f & DERIVED) !== 0) {
        if ((source2.f & DIRTY) !== 0) {
          execute_derived(
            /** @type {Derived} */
            source2
          );
        }
        set_signal_status(source2, (source2.f & UNOWNED) === 0 ? CLEAN : MAYBE_DIRTY);
      }
      source2.wv = increment_write_version();
      mark_reactions(source2, DIRTY);
      if (active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
        if (untracked_writes === null) {
          set_untracked_writes([source2]);
        } else {
          untracked_writes.push(source2);
        }
      }
    }
    return value;
  }
  function update(source2, d = 1) {
    var value = get(source2);
    var result = d === 1 ? value++ : value--;
    set(source2, value);
    return result;
  }
  function increment(source2) {
    set(source2, source2.v + 1);
  }
  function mark_reactions(signal, status) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var length = reactions.length;
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags = reaction.f;
      var not_dirty = (flags & DIRTY) === 0;
      if (not_dirty) {
        set_signal_status(reaction, status);
      }
      if ((flags & DERIVED) !== 0) {
        mark_reactions(
          /** @type {Derived} */
          reaction,
          MAYBE_DIRTY
        );
      } else if (not_dirty) {
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
  function proxy(value) {
    if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
      return value;
    }
    const prototype = get_prototype_of(value);
    if (prototype !== object_prototype && prototype !== array_prototype) {
      return value;
    }
    var sources = /* @__PURE__ */ new Map();
    var is_proxied_array = is_array(value);
    var version = /* @__PURE__ */ state(0);
    var parent_version = update_version;
    var with_parent = (fn) => {
      if (update_version === parent_version) {
        return fn();
      }
      var reaction = active_reaction;
      var version2 = update_version;
      set_active_reaction(null);
      set_update_version(parent_version);
      var result = fn();
      set_active_reaction(reaction);
      set_update_version(version2);
      return result;
    };
    if (is_proxied_array) {
      sources.set("length", /* @__PURE__ */ state(
        /** @type {any[]} */
        value.length
      ));
    }
    return new Proxy(
      /** @type {any} */
      value,
      {
        defineProperty(_, prop2, descriptor) {
          if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
            state_descriptors_fixed();
          }
          var s = sources.get(prop2);
          if (s === void 0) {
            s = with_parent(() => {
              var s2 = /* @__PURE__ */ state(descriptor.value);
              sources.set(prop2, s2);
              return s2;
            });
          } else {
            set(s, descriptor.value, true);
          }
          return true;
        },
        deleteProperty(target, prop2) {
          var s = sources.get(prop2);
          if (s === void 0) {
            if (prop2 in target) {
              const s2 = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
              sources.set(prop2, s2);
              increment(version);
            }
          } else {
            set(s, UNINITIALIZED);
            increment(version);
          }
          return true;
        },
        get(target, prop2, receiver) {
          if (prop2 === STATE_SYMBOL) {
            return value;
          }
          var s = sources.get(prop2);
          var exists = prop2 in target;
          if (s === void 0 && (!exists || get_descriptor(target, prop2)?.writable)) {
            s = with_parent(() => {
              var p = proxy(exists ? target[prop2] : UNINITIALIZED);
              var s2 = /* @__PURE__ */ state(p);
              return s2;
            });
            sources.set(prop2, s);
          }
          if (s !== void 0) {
            var v = get(s);
            return v === UNINITIALIZED ? void 0 : v;
          }
          return Reflect.get(target, prop2, receiver);
        },
        getOwnPropertyDescriptor(target, prop2) {
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor && "value" in descriptor) {
            var s = sources.get(prop2);
            if (s) descriptor.value = get(s);
          } else if (descriptor === void 0) {
            var source2 = sources.get(prop2);
            var value2 = source2?.v;
            if (source2 !== void 0 && value2 !== UNINITIALIZED) {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true
              };
            }
          }
          return descriptor;
        },
        has(target, prop2) {
          if (prop2 === STATE_SYMBOL) {
            return true;
          }
          var s = sources.get(prop2);
          var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop2);
          if (s !== void 0 || active_effect !== null && (!has || get_descriptor(target, prop2)?.writable)) {
            if (s === void 0) {
              s = with_parent(() => {
                var p = has ? proxy(target[prop2]) : UNINITIALIZED;
                var s2 = /* @__PURE__ */ state(p);
                return s2;
              });
              sources.set(prop2, s);
            }
            var value2 = get(s);
            if (value2 === UNINITIALIZED) {
              return false;
            }
          }
          return has;
        },
        set(target, prop2, value2, receiver) {
          var s = sources.get(prop2);
          var has = prop2 in target;
          if (is_proxied_array && prop2 === "length") {
            for (var i = value2; i < /** @type {Source<number>} */
            s.v; i += 1) {
              var other_s = sources.get(i + "");
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i in target) {
                other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
                sources.set(i + "", other_s);
              }
            }
          }
          if (s === void 0) {
            if (!has || get_descriptor(target, prop2)?.writable) {
              s = with_parent(() => /* @__PURE__ */ state(void 0));
              set(s, proxy(value2));
              sources.set(prop2, s);
            }
          } else {
            has = s.v !== UNINITIALIZED;
            var p = with_parent(() => proxy(value2));
            set(s, p);
          }
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor?.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop2 === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
              var n = Number(prop2);
              if (Number.isInteger(n) && n >= ls.v) {
                set(ls, n + 1);
              }
            }
            increment(version);
          }
          return true;
        },
        ownKeys(target) {
          get(version);
          var own_keys = Reflect.ownKeys(target).filter((key3) => {
            var source3 = sources.get(key3);
            return source3 === void 0 || source3.v !== UNINITIALIZED;
          });
          for (var [key2, source2] of sources) {
            if (source2.v !== UNINITIALIZED && !(key2 in target)) {
              own_keys.push(key2);
            }
          }
          return own_keys;
        },
        setPrototypeOf() {
          state_prototype_fixed();
        }
      }
    );
  }
  var $window;
  var is_firefox;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    is_firefox = /Firefox/.test(navigator.userAgent);
    var element_prototype = Element.prototype;
    var node_prototype = Node.prototype;
    var text_prototype = Text.prototype;
    first_child_getter = get_descriptor(node_prototype, "firstChild").get;
    next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
    if (is_extensible(element_prototype)) {
      element_prototype.__click = void 0;
      element_prototype.__className = void 0;
      element_prototype.__attributes = null;
      element_prototype.__style = void 0;
      element_prototype.__e = void 0;
    }
    if (is_extensible(text_prototype)) {
      text_prototype.__t = void 0;
    }
  }
  function create_text(value = "") {
    return document.createTextNode(value);
  }
  // @__NO_SIDE_EFFECTS__
  function get_first_child(node) {
    return first_child_getter.call(node);
  }
  // @__NO_SIDE_EFFECTS__
  function get_next_sibling(node) {
    return next_sibling_getter.call(node);
  }
  function child(node, is_text) {
    {
      return /* @__PURE__ */ get_first_child(node);
    }
  }
  function first_child(fragment, is_text) {
    {
      var first = (
        /** @type {DocumentFragment} */
        /* @__PURE__ */ get_first_child(
          /** @type {Node} */
          fragment
        )
      );
      if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
      return first;
    }
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = node;
    while (count--) {
      next_sibling = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(next_sibling);
    }
    {
      return next_sibling;
    }
  }
  function clear_text_content(node) {
    node.textContent = "";
  }
  function should_defer_append() {
    return false;
  }
  function validate_effect(rune) {
    if (active_effect === null && active_reaction === null) {
      effect_orphan();
    }
    if (active_reaction !== null && (active_reaction.f & UNOWNED) !== 0 && active_effect === null) {
      effect_in_unowned_derived();
    }
    if (is_destroying_effect) {
      effect_in_teardown();
    }
  }
  function push_effect(effect2, parent_effect) {
    var parent_last = parent_effect.last;
    if (parent_last === null) {
      parent_effect.last = parent_effect.first = effect2;
    } else {
      parent_last.next = effect2;
      effect2.prev = parent_last;
      parent_effect.last = effect2;
    }
  }
  function create_effect(type, fn, sync, push2 = true) {
    var parent = active_effect;
    if (parent !== null && (parent.f & INERT) !== 0) {
      type |= INERT;
    }
    var effect2 = {
      ctx: component_context,
      deps: null,
      nodes_start: null,
      nodes_end: null,
      f: type | DIRTY,
      first: null,
      fn,
      last: null,
      next: null,
      parent,
      b: parent && parent.b,
      prev: null,
      teardown: null,
      transitions: null,
      wv: 0,
      ac: null
    };
    if (sync) {
      try {
        update_effect(effect2);
        effect2.f |= EFFECT_RAN;
      } catch (e) {
        destroy_effect(effect2);
        throw e;
      }
    } else if (fn !== null) {
      schedule_effect(effect2);
    }
    var inert = sync && effect2.deps === null && effect2.first === null && effect2.nodes_start === null && effect2.teardown === null && (effect2.f & EFFECT_PRESERVED) === 0;
    if (!inert && push2) {
      if (parent !== null) {
        push_effect(effect2, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
        var derived2 = (
          /** @type {Derived} */
          active_reaction
        );
        (derived2.effects ??= []).push(effect2);
      }
    }
    return effect2;
  }
  function user_effect(fn) {
    validate_effect();
    var flags = (
      /** @type {Effect} */
      active_effect.f
    );
    var defer = !active_reaction && (flags & BRANCH_EFFECT) !== 0 && (flags & EFFECT_RAN) === 0;
    if (defer) {
      var context = (
        /** @type {ComponentContext} */
        component_context
      );
      (context.e ??= []).push(fn);
    } else {
      return create_user_effect(fn);
    }
  }
  function create_user_effect(fn) {
    return create_effect(EFFECT | USER_EFFECT, fn, false);
  }
  function component_root(fn) {
    Batch.ensure();
    const effect2 = create_effect(ROOT_EFFECT, fn, true);
    return (options = {}) => {
      return new Promise((fulfil) => {
        if (options.outro) {
          pause_effect(effect2, () => {
            destroy_effect(effect2);
            fulfil(void 0);
          });
        } else {
          destroy_effect(effect2);
          fulfil(void 0);
        }
      });
    };
  }
  function effect(fn) {
    return create_effect(EFFECT, fn, false);
  }
  function async_effect(fn) {
    return create_effect(ASYNC | EFFECT_PRESERVED, fn, true);
  }
  function render_effect(fn, flags = 0) {
    return create_effect(RENDER_EFFECT | flags, fn, true);
  }
  function template_effect(fn, sync = [], async = []) {
    flatten(sync, async, (values) => {
      create_effect(RENDER_EFFECT, () => fn(...values.map(get)), true);
    });
  }
  function block(fn, flags = 0) {
    var effect2 = create_effect(BLOCK_EFFECT | flags, fn, true);
    return effect2;
  }
  function branch(fn, push2 = true) {
    return create_effect(BRANCH_EFFECT, fn, true, push2);
  }
  function execute_effect_teardown(effect2) {
    var teardown = effect2.teardown;
    if (teardown !== null) {
      const previously_destroying_effect = is_destroying_effect;
      const previous_reaction = active_reaction;
      set_is_destroying_effect(true);
      set_active_reaction(null);
      try {
        teardown.call(null);
      } finally {
        set_is_destroying_effect(previously_destroying_effect);
        set_active_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var effect2 = signal.first;
    signal.first = signal.last = null;
    while (effect2 !== null) {
      effect2.ac?.abort(STALE_REACTION);
      var next = effect2.next;
      if ((effect2.f & ROOT_EFFECT) !== 0) {
        effect2.parent = null;
      } else {
        destroy_effect(effect2, remove_dom);
      }
      effect2 = next;
    }
  }
  function destroy_block_effect_children(signal) {
    var effect2 = signal.first;
    while (effect2 !== null) {
      var next = effect2.next;
      if ((effect2.f & BRANCH_EFFECT) === 0) {
        destroy_effect(effect2);
      }
      effect2 = next;
    }
  }
  function destroy_effect(effect2, remove_dom = true) {
    var removed = false;
    if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes_start !== null && effect2.nodes_end !== null) {
      remove_effect_dom(
        effect2.nodes_start,
        /** @type {TemplateNode} */
        effect2.nodes_end
      );
      removed = true;
    }
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    set_signal_status(effect2, DESTROYED);
    var transitions = effect2.transitions;
    if (transitions !== null) {
      for (const transition of transitions) {
        transition.stop();
      }
    }
    execute_effect_teardown(effect2);
    var parent = effect2.parent;
    if (parent !== null && parent.first !== null) {
      unlink_effect(effect2);
    }
    effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes_start = effect2.nodes_end = effect2.ac = null;
  }
  function remove_effect_dom(node, end) {
    while (node !== null) {
      var next = node === end ? null : (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      node.remove();
      node = next;
    }
  }
  function unlink_effect(effect2) {
    var parent = effect2.parent;
    var prev = effect2.prev;
    var next = effect2.next;
    if (prev !== null) prev.next = next;
    if (next !== null) next.prev = prev;
    if (parent !== null) {
      if (parent.first === effect2) parent.first = next;
      if (parent.last === effect2) parent.last = prev;
    }
  }
  function pause_effect(effect2, callback) {
    var transitions = [];
    pause_children(effect2, transitions, true);
    run_out_transitions(transitions, () => {
      destroy_effect(effect2);
      if (callback) callback();
    });
  }
  function run_out_transitions(transitions, fn) {
    var remaining = transitions.length;
    if (remaining > 0) {
      var check = () => --remaining || fn();
      for (var transition of transitions) {
        transition.out(check);
      }
    } else {
      fn();
    }
  }
  function pause_children(effect2, transitions, local) {
    if ((effect2.f & INERT) !== 0) return;
    effect2.f ^= INERT;
    if (effect2.transitions !== null) {
      for (const transition of effect2.transitions) {
        if (transition.is_global || local) {
          transitions.push(transition);
        }
      }
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
      child2 = sibling2;
    }
  }
  function resume_effect(effect2) {
    resume_children(effect2, true);
  }
  function resume_children(effect2, local) {
    if ((effect2.f & INERT) === 0) return;
    effect2.f ^= INERT;
    if ((effect2.f & CLEAN) === 0) {
      set_signal_status(effect2, DIRTY);
      schedule_effect(effect2);
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    if (effect2.transitions !== null) {
      for (const transition of effect2.transitions) {
        if (transition.is_global || local) {
          transition.in();
        }
      }
    }
  }
  let is_updating_effect = false;
  function set_is_updating_effect(value) {
    is_updating_effect = value;
  }
  let is_destroying_effect = false;
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  let active_reaction = null;
  let untracking = false;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  let active_effect = null;
  function set_active_effect(effect2) {
    active_effect = effect2;
  }
  let current_sources = null;
  function push_reaction_value(value) {
    if (active_reaction !== null && true) {
      if (current_sources === null) {
        current_sources = [value];
      } else {
        current_sources.push(value);
      }
    }
  }
  let new_deps = null;
  let skipped_deps = 0;
  let untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  let write_version = 1;
  let read_version = 0;
  let update_version = read_version;
  function set_update_version(value) {
    update_version = value;
  }
  let skip_reaction = false;
  function increment_write_version() {
    return ++write_version;
  }
  function is_dirty(reaction) {
    var flags = reaction.f;
    if ((flags & DIRTY) !== 0) {
      return true;
    }
    if ((flags & MAYBE_DIRTY) !== 0) {
      var dependencies = reaction.deps;
      var is_unowned = (flags & UNOWNED) !== 0;
      if (dependencies !== null) {
        var i;
        var dependency;
        var is_disconnected = (flags & DISCONNECTED) !== 0;
        var is_unowned_connected = is_unowned && active_effect !== null && !skip_reaction;
        var length = dependencies.length;
        if ((is_disconnected || is_unowned_connected) && (active_effect === null || (active_effect.f & DESTROYED) === 0)) {
          var derived2 = (
            /** @type {Derived} */
            reaction
          );
          var parent = derived2.parent;
          for (i = 0; i < length; i++) {
            dependency = dependencies[i];
            if (is_disconnected || !dependency?.reactions?.includes(derived2)) {
              (dependency.reactions ??= []).push(derived2);
            }
          }
          if (is_disconnected) {
            derived2.f ^= DISCONNECTED;
          }
          if (is_unowned_connected && parent !== null && (parent.f & UNOWNED) === 0) {
            derived2.f ^= UNOWNED;
          }
        }
        for (i = 0; i < length; i++) {
          dependency = dependencies[i];
          if (is_dirty(
            /** @type {Derived} */
            dependency
          )) {
            update_derived(
              /** @type {Derived} */
              dependency
            );
          }
          if (dependency.wv > reaction.wv) {
            return true;
          }
        }
      }
      if (!is_unowned || active_effect !== null && !skip_reaction) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function schedule_possible_effect_self_invalidation(signal, effect2, root2 = true) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    if (current_sources?.includes(signal)) {
      return;
    }
    for (var i = 0; i < reactions.length; i++) {
      var reaction = reactions[i];
      if ((reaction.f & DERIVED) !== 0) {
        schedule_possible_effect_self_invalidation(
          /** @type {Derived} */
          reaction,
          effect2,
          false
        );
      } else if (effect2 === reaction) {
        if (root2) {
          set_signal_status(reaction, DIRTY);
        } else if ((reaction.f & CLEAN) !== 0) {
          set_signal_status(reaction, MAYBE_DIRTY);
        }
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
  function update_reaction(reaction) {
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_skip_reaction = skip_reaction;
    var previous_sources = current_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var previous_update_version = update_version;
    var flags = reaction.f;
    new_deps = /** @type {null | Value[]} */
    null;
    skipped_deps = 0;
    untracked_writes = null;
    skip_reaction = (flags & UNOWNED) !== 0 && (untracking || !is_updating_effect || active_reaction === null);
    active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    current_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    update_version = ++read_version;
    if (reaction.ac !== null) {
      reaction.ac.abort(STALE_REACTION);
      reaction.ac = null;
    }
    try {
      reaction.f |= REACTION_IS_UPDATING;
      var result = (
        /** @type {Function} */
        (0, reaction.fn)()
      );
      var deps = reaction.deps;
      if (new_deps !== null) {
        var i;
        remove_reactions(reaction, skipped_deps);
        if (deps !== null && skipped_deps > 0) {
          deps.length = skipped_deps + new_deps.length;
          for (i = 0; i < new_deps.length; i++) {
            deps[skipped_deps + i] = new_deps[i];
          }
        } else {
          reaction.deps = deps = new_deps;
        }
        if (!skip_reaction || // Deriveds that already have reactions can cleanup, so we still add them as reactions
        (flags & DERIVED) !== 0 && /** @type {import('#client').Derived} */
        reaction.reactions !== null) {
          for (i = skipped_deps; i < deps.length; i++) {
            (deps[i].reactions ??= []).push(reaction);
          }
        }
      } else if (deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
        for (i = 0; i < /** @type {Source[]} */
        untracked_writes.length; i++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i],
            /** @type {Effect} */
            reaction
          );
        }
      }
      if (previous_reaction !== null && previous_reaction !== reaction) {
        read_version++;
        if (untracked_writes !== null) {
          if (previous_untracked_writes === null) {
            previous_untracked_writes = untracked_writes;
          } else {
            previous_untracked_writes.push(.../** @type {Source[]} */
            untracked_writes);
          }
        }
      }
      if ((reaction.f & ERROR_VALUE) !== 0) {
        reaction.f ^= ERROR_VALUE;
      }
      return result;
    } catch (error) {
      return handle_error(error);
    } finally {
      reaction.f ^= REACTION_IS_UPDATING;
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      skip_reaction = previous_skip_reaction;
      current_sources = previous_sources;
      set_component_context(previous_component_context);
      untracking = previous_untracking;
      update_version = previous_update_version;
    }
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index2 = index_of.call(reactions, signal);
      if (index2 !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index2] = reactions[new_length];
          reactions.pop();
        }
      }
    }
    if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
    // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
    // allows us to skip the expensive work of disconnecting and immediately reconnecting it
    (new_deps === null || !new_deps.includes(dependency))) {
      set_signal_status(dependency, MAYBE_DIRTY);
      if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
        dependency.f ^= DISCONNECTED;
      }
      destroy_derived_effects(
        /** @type {Derived} **/
        dependency
      );
      remove_reactions(
        /** @type {Derived} **/
        dependency,
        0
      );
    }
  }
  function remove_reactions(signal, start_index) {
    var dependencies = signal.deps;
    if (dependencies === null) return;
    for (var i = start_index; i < dependencies.length; i++) {
      remove_reaction(signal, dependencies[i]);
    }
  }
  function update_effect(effect2) {
    var flags = effect2.f;
    if ((flags & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect2, CLEAN);
    var previous_effect = active_effect;
    var was_updating_effect = is_updating_effect;
    active_effect = effect2;
    is_updating_effect = true;
    try {
      if ((flags & BLOCK_EFFECT) !== 0) {
        destroy_block_effect_children(effect2);
      } else {
        destroy_effect_children(effect2);
      }
      execute_effect_teardown(effect2);
      var teardown = update_reaction(effect2);
      effect2.teardown = typeof teardown === "function" ? teardown : null;
      effect2.wv = write_version;
      var dep;
      if (DEV && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) ;
    } finally {
      is_updating_effect = was_updating_effect;
      active_effect = previous_effect;
    }
  }
  function get(signal) {
    var flags = signal.f;
    var is_derived = (flags & DERIVED) !== 0;
    if (active_reaction !== null && !untracking) {
      var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
      if (!destroyed && !current_sources?.includes(signal)) {
        var deps = active_reaction.deps;
        if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
          if (signal.rv < read_version) {
            signal.rv = read_version;
            if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
              skipped_deps++;
            } else if (new_deps === null) {
              new_deps = [signal];
            } else if (!skip_reaction || !new_deps.includes(signal)) {
              new_deps.push(signal);
            }
          }
        } else {
          (active_reaction.deps ??= []).push(signal);
          var reactions = signal.reactions;
          if (reactions === null) {
            signal.reactions = [active_reaction];
          } else if (!reactions.includes(active_reaction)) {
            reactions.push(active_reaction);
          }
        }
      }
    } else if (is_derived && /** @type {Derived} */
    signal.deps === null && /** @type {Derived} */
    signal.effects === null) {
      var derived2 = (
        /** @type {Derived} */
        signal
      );
      var parent = derived2.parent;
      if (parent !== null && (parent.f & UNOWNED) === 0) {
        derived2.f ^= UNOWNED;
      }
    }
    if (is_destroying_effect) {
      if (old_values.has(signal)) {
        return old_values.get(signal);
      }
      if (is_derived) {
        derived2 = /** @type {Derived} */
        signal;
        var value = derived2.v;
        if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
          value = execute_derived(derived2);
        }
        old_values.set(derived2, value);
        return value;
      }
    } else if (is_derived) {
      derived2 = /** @type {Derived} */
      signal;
      if (batch_deriveds?.has(derived2)) {
        return batch_deriveds.get(derived2);
      }
      if (is_dirty(derived2)) {
        update_derived(derived2);
      }
    }
    if ((signal.f & ERROR_VALUE) !== 0) {
      throw signal.v;
    }
    return signal.v;
  }
  function depends_on_old_values(derived2) {
    if (derived2.v === UNINITIALIZED) return true;
    if (derived2.deps === null) return false;
    for (const dep of derived2.deps) {
      if (old_values.has(dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
        /** @type {Derived} */
        dep
      )) {
        return true;
      }
    }
    return false;
  }
  function untrack(fn) {
    var previous_untracking = untracking;
    try {
      untracking = true;
      return fn();
    } finally {
      untracking = previous_untracking;
    }
  }
  const STATUS_MASK = -7169;
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  const PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  let listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        "reset",
        (evt) => {
          Promise.resolve().then(() => {
            if (!evt.defaultPrevented) {
              for (
                const e of
                /**@type {HTMLFormElement} */
                evt.target.elements
              ) {
                e.__on_r?.();
              }
            }
          });
        },
        // In the capture phase to guarantee we get noticed of it (no possiblity of stopPropagation)
        { capture: true }
      );
    }
  }
  function without_reactive_context(fn) {
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      return fn();
    } finally {
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function listen_to_event_and_reset_event(element, event, handler, on_reset = handler) {
    element.addEventListener(event, () => without_reactive_context(handler));
    const prev = element.__on_r;
    if (prev) {
      element.__on_r = () => {
        prev();
        on_reset(true);
      };
    } else {
      element.__on_r = () => on_reset(true);
    }
    add_form_reset_listener();
  }
  const all_registered_events = /* @__PURE__ */ new Set();
  const root_event_handles = /* @__PURE__ */ new Set();
  function delegate(events) {
    for (var i = 0; i < events.length; i++) {
      all_registered_events.add(events[i]);
    }
    for (var fn of root_event_handles) {
      fn(events);
    }
  }
  let last_propagated_event = null;
  function handle_event_propagation(event) {
    var handler_element = this;
    var owner_document = (
      /** @type {Node} */
      handler_element.ownerDocument
    );
    var event_name = event.type;
    var path = event.composedPath?.() || [];
    var current_target = (
      /** @type {null | Element} */
      path[0] || event.target
    );
    last_propagated_event = event;
    var path_idx = 0;
    var handled_at = last_propagated_event === event && event.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
      window)) {
        event.__root = handler_element;
        return;
      }
      var handler_idx = path.indexOf(handler_element);
      if (handler_idx === -1) {
        return;
      }
      if (at_idx <= handler_idx) {
        path_idx = at_idx;
      }
    }
    current_target = /** @type {Element} */
    path[path_idx] || event.target;
    if (current_target === handler_element) return;
    define_property(event, "currentTarget", {
      configurable: true,
      get() {
        return current_target || owner_document;
      }
    });
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
        current_target.host || null;
        try {
          var delegated = current_target["__" + event_name];
          if (delegated != null && (!/** @type {any} */
          current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          event.target === current_target)) {
            if (is_array(delegated)) {
              var [fn, ...data] = delegated;
              fn.apply(current_target, [event, ...data]);
            } else {
              delegated.call(current_target, event);
            }
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
          break;
        }
        current_target = parent_element;
      }
      if (throw_error) {
        for (let error of other_errors) {
          queueMicrotask(() => {
            throw error;
          });
        }
        throw throw_error;
      }
    } finally {
      event.__root = handler_element;
      delete event.currentTarget;
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function create_fragment_from_html(html2) {
    var elem = document.createElement("template");
    elem.innerHTML = html2.replaceAll("<!>", "<!---->");
    return elem.content;
  }
  function assign_nodes(start, end) {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    if (effect2.nodes_start === null) {
      effect2.nodes_start = start;
      effect2.nodes_end = end;
    }
  }
  // @__NO_SIDE_EFFECTS__
  function from_html(content, flags) {
    var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
    var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        if (!is_fragment) node = /** @type {Node} */
        /* @__PURE__ */ get_first_child(node);
      }
      var clone = (
        /** @type {TemplateNode} */
        use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
      );
      if (is_fragment) {
        var start = (
          /** @type {TemplateNode} */
          /* @__PURE__ */ get_first_child(clone)
        );
        var end = (
          /** @type {TemplateNode} */
          clone.lastChild
        );
        assign_nodes(start, end);
      } else {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  // @__NO_SIDE_EFFECTS__
  function from_namespace(content, flags, ns = "svg") {
    var has_start = !content.startsWith("<!>");
    var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
    var node;
    return () => {
      if (!node) {
        var fragment = (
          /** @type {DocumentFragment} */
          create_fragment_from_html(wrapped)
        );
        var root2 = (
          /** @type {Element} */
          /* @__PURE__ */ get_first_child(fragment)
        );
        {
          node = /** @type {Element} */
          /* @__PURE__ */ get_first_child(root2);
        }
      }
      var clone = (
        /** @type {TemplateNode} */
        node.cloneNode(true)
      );
      {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  // @__NO_SIDE_EFFECTS__
  function from_svg(content, flags) {
    return /* @__PURE__ */ from_namespace(content, flags, "svg");
  }
  function text(value = "") {
    {
      var t = create_text(value + "");
      assign_nodes(t, t);
      return t;
    }
  }
  function comment() {
    var frag = document.createDocumentFragment();
    var start = document.createComment("");
    var anchor = create_text();
    frag.append(start, anchor);
    assign_nodes(start, anchor);
    return frag;
  }
  function append(anchor, dom) {
    if (anchor === null) {
      return;
    }
    anchor.before(
      /** @type {Node} */
      dom
    );
  }
  function set_text(text2, value) {
    var str = value == null ? "" : typeof value === "object" ? value + "" : value;
    if (str !== (text2.__t ??= text2.nodeValue)) {
      text2.__t = str;
      text2.nodeValue = str + "";
    }
  }
  function mount(component, options) {
    return _mount(component, options);
  }
  const document_listeners = /* @__PURE__ */ new Map();
  function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
    init_operations();
    var registered_events = /* @__PURE__ */ new Set();
    var event_handle = (events2) => {
      for (var i = 0; i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        target.addEventListener(event_name, handle_event_propagation, { passive });
        var n = document_listeners.get(event_name);
        if (n === void 0) {
          document.addEventListener(event_name, handle_event_propagation, { passive });
          document_listeners.set(event_name, 1);
        } else {
          document_listeners.set(event_name, n + 1);
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    var component = void 0;
    var unmount = component_root(() => {
      var anchor_node = anchor ?? target.appendChild(create_text());
      branch(() => {
        if (context) {
          push({});
          var ctx = (
            /** @type {ComponentContext} */
            component_context
          );
          ctx.c = context;
        }
        if (events) {
          props.$$events = events;
        }
        component = Component(anchor_node, props) || {};
        if (context) {
          pop();
        }
      });
      return () => {
        for (var event_name of registered_events) {
          target.removeEventListener(event_name, handle_event_propagation);
          var n = (
            /** @type {number} */
            document_listeners.get(event_name)
          );
          if (--n === 0) {
            document.removeEventListener(event_name, handle_event_propagation);
            document_listeners.delete(event_name);
          } else {
            document_listeners.set(event_name, n);
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          anchor_node.parentNode?.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component, unmount);
    return component;
  }
  let mounted_components = /* @__PURE__ */ new WeakMap();
  function if_block(node, fn, elseif = false) {
    var anchor = node;
    var consequent_effect = null;
    var alternate_effect = null;
    var condition = UNINITIALIZED;
    var flags = elseif ? EFFECT_TRANSPARENT : 0;
    var has_branch = false;
    const set_branch = (fn2, flag = true) => {
      has_branch = true;
      update_branch(flag, fn2);
    };
    var offscreen_fragment = null;
    function commit() {
      if (offscreen_fragment !== null) {
        offscreen_fragment.lastChild.remove();
        anchor.before(offscreen_fragment);
        offscreen_fragment = null;
      }
      var active = condition ? consequent_effect : alternate_effect;
      var inactive = condition ? alternate_effect : consequent_effect;
      if (active) {
        resume_effect(active);
      }
      if (inactive) {
        pause_effect(inactive, () => {
          if (condition) {
            alternate_effect = null;
          } else {
            consequent_effect = null;
          }
        });
      }
    }
    const update_branch = (new_condition, fn2) => {
      if (condition === (condition = new_condition)) return;
      var defer = should_defer_append();
      var target = anchor;
      if (defer) {
        offscreen_fragment = document.createDocumentFragment();
        offscreen_fragment.append(target = create_text());
      }
      if (condition) {
        consequent_effect ??= fn2 && branch(() => fn2(target));
      } else {
        alternate_effect ??= fn2 && branch(() => fn2(target));
      }
      if (defer) {
        var batch = (
          /** @type {Batch} */
          current_batch
        );
        var active = condition ? consequent_effect : alternate_effect;
        var inactive = condition ? alternate_effect : consequent_effect;
        if (active) batch.skipped_effects.delete(active);
        if (inactive) batch.skipped_effects.add(inactive);
        batch.add_callback(commit);
      } else {
        commit();
      }
    };
    block(() => {
      has_branch = false;
      fn(set_branch);
      if (!has_branch) {
        update_branch(null, null);
      }
    }, flags);
  }
  function key(node, get_key, render_fn) {
    var anchor = node;
    var key2 = UNINITIALIZED;
    var effect2;
    var pending_effect;
    var offscreen_fragment = null;
    var changed = not_equal;
    function commit() {
      if (effect2) {
        pause_effect(effect2);
      }
      if (offscreen_fragment !== null) {
        offscreen_fragment.lastChild.remove();
        anchor.before(offscreen_fragment);
        offscreen_fragment = null;
      }
      effect2 = pending_effect;
    }
    block(() => {
      if (changed(key2, key2 = get_key())) {
        var target = anchor;
        var defer = should_defer_append();
        if (defer) {
          offscreen_fragment = document.createDocumentFragment();
          offscreen_fragment.append(target = create_text());
        }
        pending_effect = branch(() => render_fn(target));
        if (defer) {
          current_batch.add_callback(commit);
        } else {
          commit();
        }
      }
    });
  }
  function index(_, i) {
    return i;
  }
  function pause_effects(state2, items, controlled_anchor) {
    var items_map = state2.items;
    var transitions = [];
    var length = items.length;
    for (var i = 0; i < length; i++) {
      pause_children(items[i].e, transitions, true);
    }
    var is_controlled = length > 0 && transitions.length === 0 && controlled_anchor !== null;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        /** @type {Element} */
        controlled_anchor.parentNode
      );
      clear_text_content(parent_node);
      parent_node.append(
        /** @type {Element} */
        controlled_anchor
      );
      items_map.clear();
      link(state2, items[0].prev, items[length - 1].next);
    }
    run_out_transitions(transitions, () => {
      for (var i2 = 0; i2 < length; i2++) {
        var item = items[i2];
        if (!is_controlled) {
          items_map.delete(item.k);
          link(state2, item.prev, item.next);
        }
        destroy_effect(item.e, !is_controlled);
      }
    });
  }
  function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
    var anchor = node;
    var state2 = { flags, items: /* @__PURE__ */ new Map(), first: null };
    var is_controlled = (flags & EACH_IS_CONTROLLED) !== 0;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        node
      );
      anchor = parent_node.appendChild(create_text());
    }
    var fallback = null;
    var was_empty = false;
    var offscreen_items = /* @__PURE__ */ new Map();
    var each_array = /* @__PURE__ */ derived_safe_equal(() => {
      var collection = get_collection();
      return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
    });
    var array;
    var each_effect;
    function commit() {
      reconcile(
        each_effect,
        array,
        state2,
        offscreen_items,
        anchor,
        render_fn,
        flags,
        get_key,
        get_collection
      );
      if (fallback_fn !== null) {
        if (array.length === 0) {
          if (fallback) {
            resume_effect(fallback);
          } else {
            fallback = branch(() => fallback_fn(anchor));
          }
        } else if (fallback !== null) {
          pause_effect(fallback, () => {
            fallback = null;
          });
        }
      }
    }
    block(() => {
      each_effect ??= /** @type {Effect} */
      active_effect;
      array = get(each_array);
      var length = array.length;
      if (was_empty && length === 0) {
        return;
      }
      was_empty = length === 0;
      var item, i, value, key2;
      {
        if (should_defer_append()) {
          var keys = /* @__PURE__ */ new Set();
          var batch = (
            /** @type {Batch} */
            current_batch
          );
          for (i = 0; i < length; i += 1) {
            value = array[i];
            key2 = get_key(value, i);
            var existing = state2.items.get(key2) ?? offscreen_items.get(key2);
            if (existing) {
              if ((flags & (EACH_ITEM_REACTIVE | EACH_INDEX_REACTIVE)) !== 0) {
                update_item(existing, value, i, flags);
              }
            } else {
              item = create_item(
                null,
                state2,
                null,
                null,
                value,
                key2,
                i,
                render_fn,
                flags,
                get_collection,
                true
              );
              offscreen_items.set(key2, item);
            }
            keys.add(key2);
          }
          for (const [key3, item2] of state2.items) {
            if (!keys.has(key3)) {
              batch.skipped_effects.add(item2.e);
            }
          }
          batch.add_callback(commit);
        } else {
          commit();
        }
      }
      get(each_array);
    });
  }
  function reconcile(each_effect, array, state2, offscreen_items, anchor, render_fn, flags, get_key, get_collection) {
    var is_animated = (flags & EACH_IS_ANIMATED) !== 0;
    var should_update = (flags & (EACH_ITEM_REACTIVE | EACH_INDEX_REACTIVE)) !== 0;
    var length = array.length;
    var items = state2.items;
    var first = state2.first;
    var current = first;
    var seen;
    var prev = null;
    var to_animate;
    var matched = [];
    var stashed = [];
    var value;
    var key2;
    var item;
    var i;
    if (is_animated) {
      for (i = 0; i < length; i += 1) {
        value = array[i];
        key2 = get_key(value, i);
        item = items.get(key2);
        if (item !== void 0) {
          item.a?.measure();
          (to_animate ??= /* @__PURE__ */ new Set()).add(item);
        }
      }
    }
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key2 = get_key(value, i);
      item = items.get(key2);
      if (item === void 0) {
        var pending = offscreen_items.get(key2);
        if (pending !== void 0) {
          offscreen_items.delete(key2);
          items.set(key2, pending);
          var next = prev ? prev.next : current;
          link(state2, prev, pending);
          link(state2, pending, next);
          move(pending, next, anchor);
          prev = pending;
        } else {
          var child_anchor = current ? (
            /** @type {TemplateNode} */
            current.e.nodes_start
          ) : anchor;
          prev = create_item(
            child_anchor,
            state2,
            prev,
            prev === null ? state2.first : prev.next,
            value,
            key2,
            i,
            render_fn,
            flags,
            get_collection
          );
        }
        items.set(key2, prev);
        matched = [];
        stashed = [];
        current = prev.next;
        continue;
      }
      if (should_update) {
        update_item(item, value, i, flags);
      }
      if ((item.e.f & INERT) !== 0) {
        resume_effect(item.e);
        if (is_animated) {
          item.a?.unfix();
          (to_animate ??= /* @__PURE__ */ new Set()).delete(item);
        }
      }
      if (item !== current) {
        if (seen !== void 0 && seen.has(item)) {
          if (matched.length < stashed.length) {
            var start = stashed[0];
            var j;
            prev = start.prev;
            var a = matched[0];
            var b = matched[matched.length - 1];
            for (j = 0; j < matched.length; j += 1) {
              move(matched[j], start, anchor);
            }
            for (j = 0; j < stashed.length; j += 1) {
              seen.delete(stashed[j]);
            }
            link(state2, a.prev, b.next);
            link(state2, prev, a);
            link(state2, b, start);
            current = start;
            prev = b;
            i -= 1;
            matched = [];
            stashed = [];
          } else {
            seen.delete(item);
            move(item, current, anchor);
            link(state2, item.prev, item.next);
            link(state2, item, prev === null ? state2.first : prev.next);
            link(state2, prev, item);
            prev = item;
          }
          continue;
        }
        matched = [];
        stashed = [];
        while (current !== null && current.k !== key2) {
          if ((current.e.f & INERT) === 0) {
            (seen ??= /* @__PURE__ */ new Set()).add(current);
          }
          stashed.push(current);
          current = current.next;
        }
        if (current === null) {
          continue;
        }
        item = current;
      }
      matched.push(item);
      prev = item;
      current = item.next;
    }
    if (current !== null || seen !== void 0) {
      var to_destroy = seen === void 0 ? [] : array_from(seen);
      while (current !== null) {
        if ((current.e.f & INERT) === 0) {
          to_destroy.push(current);
        }
        current = current.next;
      }
      var destroy_length = to_destroy.length;
      if (destroy_length > 0) {
        var controlled_anchor = (flags & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
        if (is_animated) {
          for (i = 0; i < destroy_length; i += 1) {
            to_destroy[i].a?.measure();
          }
          for (i = 0; i < destroy_length; i += 1) {
            to_destroy[i].a?.fix();
          }
        }
        pause_effects(state2, to_destroy, controlled_anchor);
      }
    }
    if (is_animated) {
      queue_micro_task(() => {
        if (to_animate === void 0) return;
        for (item of to_animate) {
          item.a?.apply();
        }
      });
    }
    each_effect.first = state2.first && state2.first.e;
    each_effect.last = prev && prev.e;
    for (var unused of offscreen_items.values()) {
      destroy_effect(unused.e);
    }
    offscreen_items.clear();
  }
  function update_item(item, value, index2, type) {
    if ((type & EACH_ITEM_REACTIVE) !== 0) {
      internal_set(item.v, value);
    }
    if ((type & EACH_INDEX_REACTIVE) !== 0) {
      internal_set(
        /** @type {Value<number>} */
        item.i,
        index2
      );
    } else {
      item.i = index2;
    }
  }
  function create_item(anchor, state2, prev, next, value, key2, index2, render_fn, flags, get_collection, deferred2) {
    var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
    var mutable = (flags & EACH_ITEM_IMMUTABLE) === 0;
    var v = reactive ? mutable ? /* @__PURE__ */ mutable_source(value, false, false) : source(value) : value;
    var i = (flags & EACH_INDEX_REACTIVE) === 0 ? index2 : source(index2);
    var item = {
      i,
      v,
      k: key2,
      a: null,
      // @ts-expect-error
      e: null,
      prev,
      next
    };
    try {
      if (anchor === null) {
        var fragment = document.createDocumentFragment();
        fragment.append(anchor = create_text());
      }
      item.e = branch(() => render_fn(
        /** @type {Node} */
        anchor,
        v,
        i,
        get_collection
      ), hydrating);
      item.e.prev = prev && prev.e;
      item.e.next = next && next.e;
      if (prev === null) {
        if (!deferred2) {
          state2.first = item;
        }
      } else {
        prev.next = item;
        prev.e.next = item.e;
      }
      if (next !== null) {
        next.prev = item;
        next.e.prev = item.e;
      }
      return item;
    } finally {
    }
  }
  function move(item, next, anchor) {
    var end = item.next ? (
      /** @type {TemplateNode} */
      item.next.e.nodes_start
    ) : anchor;
    var dest = next ? (
      /** @type {TemplateNode} */
      next.e.nodes_start
    ) : anchor;
    var node = (
      /** @type {TemplateNode} */
      item.e.nodes_start
    );
    while (node !== null && node !== end) {
      var next_node = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      dest.before(node);
      node = next_node;
    }
  }
  function link(state2, prev, next) {
    if (prev === null) {
      state2.first = next;
    } else {
      prev.next = next;
      prev.e.next = next && next.e;
    }
    if (next !== null) {
      next.prev = prev;
      next.e.prev = prev && prev.e;
    }
  }
  function html(node, get_value, svg = false, mathml = false, skip_warning = false) {
    var anchor = node;
    var value = "";
    template_effect(() => {
      var effect2 = (
        /** @type {Effect} */
        active_effect
      );
      if (value === (value = get_value() ?? "")) {
        return;
      }
      if (effect2.nodes_start !== null) {
        remove_effect_dom(
          effect2.nodes_start,
          /** @type {TemplateNode} */
          effect2.nodes_end
        );
        effect2.nodes_start = effect2.nodes_end = null;
      }
      if (value === "") return;
      var html2 = value + "";
      if (svg) html2 = `<svg>${html2}</svg>`;
      else if (mathml) html2 = `<math>${html2}</math>`;
      var node2 = create_fragment_from_html(html2);
      if (svg || mathml) {
        node2 = /** @type {Element} */
        /* @__PURE__ */ get_first_child(node2);
      }
      assign_nodes(
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_first_child(node2),
        /** @type {TemplateNode} */
        node2.lastChild
      );
      if (svg || mathml) {
        while (/* @__PURE__ */ get_first_child(node2)) {
          anchor.before(
            /** @type {Node} */
            /* @__PURE__ */ get_first_child(node2)
          );
        }
      } else {
        anchor.before(node2);
      }
    });
  }
  const whitespace = [..." 	\n\r\f \v\uFEFF"];
  function to_class(value, hash, directives) {
    var classname = value == null ? "" : "" + value;
    if (hash) {
      classname = classname ? classname + " " + hash : hash;
    }
    if (directives) {
      for (var key2 in directives) {
        if (directives[key2]) {
          classname = classname ? classname + " " + key2 : key2;
        } else if (classname.length) {
          var len = key2.length;
          var a = 0;
          while ((a = classname.indexOf(key2, a)) >= 0) {
            var b = a + len;
            if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
              classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
            } else {
              a = b;
            }
          }
        }
      }
    }
    return classname === "" ? null : classname;
  }
  function to_style(value, styles) {
    return value == null ? null : String(value);
  }
  function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
    var prev = dom.__className;
    if (prev !== value || prev === void 0) {
      var next_class_name = to_class(value, hash, next_classes);
      {
        if (next_class_name == null) {
          dom.removeAttribute("class");
        } else if (is_html) {
          dom.className = next_class_name;
        } else {
          dom.setAttribute("class", next_class_name);
        }
      }
      dom.__className = value;
    } else if (next_classes && prev_classes !== next_classes) {
      for (var key2 in next_classes) {
        var is_present = !!next_classes[key2];
        if (prev_classes == null || is_present !== !!prev_classes[key2]) {
          dom.classList.toggle(key2, is_present);
        }
      }
    }
    return next_classes;
  }
  function set_style(dom, value, prev_styles, next_styles) {
    var prev = dom.__style;
    if (prev !== value) {
      var next_style_attr = to_style(value);
      {
        if (next_style_attr == null) {
          dom.removeAttribute("style");
        } else {
          dom.style.cssText = next_style_attr;
        }
      }
      dom.__style = value;
    }
    return next_styles;
  }
  const IS_CUSTOM_ELEMENT = Symbol("is custom element");
  const IS_HTML = Symbol("is html");
  function set_value(element, value) {
    var attributes = get_attributes(element);
    if (attributes.value === (attributes.value = // treat null and undefined the same for the initial value
    value ?? void 0) || // @ts-expect-error
    // `progress` elements always need their value set when it's `0`
    element.value === value && (value !== 0 || element.nodeName !== "PROGRESS")) {
      return;
    }
    element.value = value ?? "";
  }
  function set_checked(element, checked) {
    var attributes = get_attributes(element);
    if (attributes.checked === (attributes.checked = // treat null and undefined the same for the initial value
    checked ?? void 0)) {
      return;
    }
    element.checked = checked;
  }
  function set_selected(element, selected) {
    if (selected) {
      if (!element.hasAttribute("selected")) {
        element.setAttribute("selected", "");
      }
    } else {
      element.removeAttribute("selected");
    }
  }
  function set_attribute(element, attribute, value, skip_warning) {
    var attributes = get_attributes(element);
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === "loading") {
      element[LOADING_ATTR_SYMBOL] = value;
    }
    if (value == null) {
      element.removeAttribute(attribute);
    } else if (typeof value !== "string" && get_setters(element).includes(attribute)) {
      element[attribute] = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
  function get_attributes(element) {
    return (
      /** @type {Record<string | symbol, unknown>} **/
      // @ts-expect-error
      element.__attributes ??= {
        [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
        [IS_HTML]: element.namespaceURI === NAMESPACE_HTML
      }
    );
  }
  var setters_cache = /* @__PURE__ */ new Map();
  function get_setters(element) {
    var setters = setters_cache.get(element.nodeName);
    if (setters) return setters;
    setters_cache.set(element.nodeName, setters = []);
    var descriptors;
    var proto = element;
    var element_proto = Element.prototype;
    while (element_proto !== proto) {
      descriptors = get_descriptors(proto);
      for (var key2 in descriptors) {
        if (descriptors[key2].set) {
          setters.push(key2);
        }
      }
      proto = get_prototype_of(proto);
    }
    return setters;
  }
  function bind_value(input, get2, set2 = get2) {
    var batches2 = /* @__PURE__ */ new WeakSet();
    listen_to_event_and_reset_event(input, "input", (is_reset) => {
      var value = is_reset ? input.defaultValue : input.value;
      value = is_numberlike_input(input) ? to_number(value) : value;
      set2(value);
      if (current_batch !== null) {
        batches2.add(current_batch);
      }
      if (value !== (value = get2())) {
        var start = input.selectionStart;
        var end = input.selectionEnd;
        input.value = value ?? "";
        if (end !== null) {
          input.selectionStart = start;
          input.selectionEnd = Math.min(end, input.value.length);
        }
      }
    });
    if (
      // If we are hydrating and the value has since changed,
      // then use the updated value from the input instead.
      // If defaultValue is set, then value == defaultValue
      // TODO Svelte 6: remove input.value check and set to empty string?
      untrack(get2) == null && input.value
    ) {
      set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
      if (current_batch !== null) {
        batches2.add(current_batch);
      }
    }
    render_effect(() => {
      var value = get2();
      if (input === document.activeElement) {
        var batch = (
          /** @type {Batch} */
          previous_batch ?? current_batch
        );
        if (batches2.has(batch)) {
          return;
        }
      }
      if (is_numberlike_input(input) && value === to_number(input.value)) {
        return;
      }
      if (input.type === "date" && !value && !input.value) {
        return;
      }
      if (value !== input.value) {
        input.value = value ?? "";
      }
    });
  }
  function is_numberlike_input(input) {
    var type = input.type;
    return type === "number" || type === "range";
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }
  function is_bound_this(bound_value, element_or_component) {
    return bound_value === element_or_component || bound_value?.[STATE_SYMBOL] === element_or_component;
  }
  function bind_this(element_or_component = {}, update2, get_value, get_parts) {
    effect(() => {
      var old_parts;
      var parts;
      render_effect(() => {
        old_parts = parts;
        parts = get_parts?.() || [];
        untrack(() => {
          if (element_or_component !== get_value(...parts)) {
            update2(element_or_component, ...parts);
            if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
              update2(null, ...old_parts);
            }
          }
        });
      });
      return () => {
        queue_micro_task(() => {
          if (parts && is_bound_this(get_value(...parts), element_or_component)) {
            update2(null, ...parts);
          }
        });
      };
    });
    return element_or_component;
  }
  let is_store_binding = false;
  function capture_store_binding(fn) {
    var previous_is_store_binding = is_store_binding;
    try {
      is_store_binding = false;
      return [fn(), is_store_binding];
    } finally {
      is_store_binding = previous_is_store_binding;
    }
  }
  function prop(props, key2, flags, fallback) {
    var bindable = (flags & PROPS_IS_BINDABLE) !== 0;
    var lazy = (flags & PROPS_IS_LAZY_INITIAL) !== 0;
    var fallback_value = (
      /** @type {V} */
      fallback
    );
    var fallback_dirty = true;
    var get_fallback = () => {
      if (fallback_dirty) {
        fallback_dirty = false;
        fallback_value = lazy ? untrack(
          /** @type {() => V} */
          fallback
        ) : (
          /** @type {V} */
          fallback
        );
      }
      return fallback_value;
    };
    var setter;
    if (bindable) {
      var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
      setter = get_descriptor(props, key2)?.set ?? (is_entry_props && key2 in props ? (v) => props[key2] = v : void 0);
    }
    var initial_value;
    var is_store_sub = false;
    if (bindable) {
      [initial_value, is_store_sub] = capture_store_binding(() => (
        /** @type {V} */
        props[key2]
      ));
    } else {
      initial_value = /** @type {V} */
      props[key2];
    }
    if (initial_value === void 0 && fallback !== void 0) {
      initial_value = get_fallback();
      if (setter) {
        props_invalid_value();
        setter(initial_value);
      }
    }
    var getter;
    {
      getter = () => {
        var value = (
          /** @type {V} */
          props[key2]
        );
        if (value === void 0) return get_fallback();
        fallback_dirty = true;
        return value;
      };
    }
    if ((flags & PROPS_IS_UPDATED) === 0) {
      return getter;
    }
    if (setter) {
      var legacy_parent = props.$$legacy;
      return function(value, mutation) {
        if (arguments.length > 0) {
          if (!mutation || legacy_parent || is_store_sub) {
            setter(mutation ? getter() : value);
          }
          return value;
        }
        return getter();
      };
    }
    var overridden = false;
    var d = ((flags & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
      overridden = false;
      return getter();
    });
    if (bindable) get(d);
    var parent_effect = (
      /** @type {Effect} */
      active_effect
    );
    return function(value, mutation) {
      if (arguments.length > 0) {
        const new_value = mutation ? get(d) : bindable ? proxy(value) : value;
        set(d, new_value);
        overridden = true;
        if (fallback_value !== void 0) {
          fallback_value = new_value;
        }
        return value;
      }
      if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
        return d.v;
      }
      return get(d);
    };
  }
  function onMount(fn) {
    if (component_context === null) {
      lifecycle_outside_component();
    }
    {
      user_effect(() => {
        const cleanup = untrack(fn);
        if (typeof cleanup === "function") return (
          /** @type {() => void} */
          cleanup
        );
      });
    }
  }
  function onDestroy(fn) {
    if (component_context === null) {
      lifecycle_outside_component();
    }
    onMount(() => () => untrack(fn));
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined") {
    ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(PUBLIC_VERSION);
  }
  const TRANSLATION_CONTEXT_KEY = "cartTranslations";
  function setTranslationContext(getter) {
    setContext(TRANSLATION_CONTEXT_KEY, getter);
  }
  function getTranslated(key2) {
    const getter = getContext(
      TRANSLATION_CONTEXT_KEY
    );
    const translations = getter?.();
    if (!translations) return null;
    const parts = key2.split(".");
    let current = translations;
    for (const part of parts) {
      if (typeof current !== "object" || current === null || !(part in current)) {
        return null;
      }
      current = current[part];
    }
    return typeof current === "string" || typeof current === "number" ? String(current) : null;
  }
  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function patternForKey(key2, global = false) {
    return new RegExp(
      `\\{\\{\\s*${escapeRegExp(key2)}\\s*\\}\\}`,
      global ? "g" : void 0
    );
  }
  function hasDynamicVariable(text2, key2) {
    if (!text2 || typeof text2 !== "string") return false;
    return patternForKey(key2).test(text2);
  }
  function replaceDynamicVariable(text2, key2, value) {
    if (!text2 || typeof text2 !== "string") return text2;
    return text2.replace(patternForKey(key2, true), value);
  }
  function replaceDynamicVariables(text2, replacements) {
    let out = text2;
    for (const [key2, value] of Object.entries(replacements)) {
      out = replaceDynamicVariable(out, key2, value);
    }
    return out;
  }
  var root$o = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-timer" aria-live="polite"> </div>`);
  function Timer($$anchor, $$props) {
    push($$props, true);
    let minutes = prop($$props, "minutes", 3, 0), text2 = prop($$props, "text", 3, ""), isPreview = prop($$props, "isPreview", 3, null);
    let endAtMs = /* @__PURE__ */ state(0);
    let remainingSeconds = /* @__PURE__ */ state(0);
    function getVisitorId() {
      try {
        let id = localStorage.getItem("moonbundle_visitor_id");
        if (!id) {
          id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : r & 3 | 8;
            return v.toString(16);
          });
          localStorage.setItem("moonbundle_visitor_id", id);
        }
        return id;
      } catch (_) {
        return "visitor-temp";
      }
    }
    function getStorageKey() {
      const visitorId = getVisitorId();
      const metafieldId = window.moonBundleCartDrawerConfig?.firstMetafield?.id || "default";
      return `moonbundle_cart_timer_${visitorId}_${metafieldId}`;
    }
    function loadPersistedTimer() {
      try {
        const raw = localStorage.getItem(getStorageKey());
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (typeof data?.endAtMs === "number" && isFinite(data.endAtMs) && typeof data?.minutes === "number") {
          return data;
        }
        return null;
      } catch (_) {
        return null;
      }
    }
    function persistTimer(targetEndAtMs, persistedMinutes) {
      try {
        localStorage.setItem(getStorageKey(), JSON.stringify({
          endAtMs: targetEndAtMs,
          minutes: persistedMinutes,
          lastUpdate: Date.now()
        }));
      } catch (_) {
      }
    }
    function clearPersistedTimer() {
      try {
        localStorage.removeItem(getStorageKey());
      } catch (_) {
      }
    }
    user_effect(() => {
      const clampedMinutes = Math.max(0, minutes());
      if (isPreview() === true) {
        set(endAtMs, Date.now() + clampedMinutes * 60 * 1e3);
        return;
      }
      const persisted = loadPersistedTimer();
      if (persisted && typeof persisted.endAtMs === "number") {
        if (persisted.minutes !== clampedMinutes) {
          set(endAtMs, Date.now() + clampedMinutes * 60 * 1e3);
          persistTimer(get(endAtMs), clampedMinutes);
        } else {
          set(endAtMs, persisted.endAtMs, true);
          if (get(endAtMs) <= Date.now()) {
            clearPersistedTimer();
          }
        }
      } else {
        set(endAtMs, Date.now() + clampedMinutes * 60 * 1e3);
        persistTimer(get(endAtMs), clampedMinutes);
      }
    });
    let formattedText = /* @__PURE__ */ user_derived(() => () => {
      const total = Math.max(0, get(remainingSeconds));
      const mins = Math.floor(total / 60);
      const secs = total % 60;
      const minsPadded = String(mins).padStart(2, "0");
      const secsPadded = String(secs).padStart(2, "0");
      const effectiveText = getTranslated("timer.textTimer") || text2();
      if (effectiveText) {
        if (hasDynamicVariable(effectiveText, "minutes")) {
          return replaceDynamicVariable(effectiveText, "minutes", `${minsPadded}:${secsPadded}`);
        }
        if (hasDynamicVariable(effectiveText, "seconds")) {
          return replaceDynamicVariable(effectiveText, "seconds", secsPadded);
        }
      }
      return `${minsPadded}:${secsPadded}`;
    });
    let intervalId = null;
    user_effect(() => {
      if (!get(endAtMs)) return;
      const tick = () => {
        const msLeft = Math.max(0, get(endAtMs) - Date.now());
        set(remainingSeconds, Math.ceil(msLeft / 1e3), true);
        if (msLeft <= 0 && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
          if (isPreview() === true) {
            return;
          }
          fetch("/cart/clear.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          }).then((res) => {
            if (!res.ok) return res.text().then((t) => Promise.reject(new Error(t || "Failed to clear cart")));
          }).then(() => {
            window.dispatchEvent(new CustomEvent("moonbundle-cart-updated"));
          }).catch((err) => {
            console.error("Error clearing cart on timer completion:", err);
          });
          clearPersistedTimer();
        }
      };
      tick();
      intervalId = setInterval(tick, 250);
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      };
    });
    var div = root$o();
    var text_1 = child(div);
    template_effect(($0) => set_text(text_1, $0), [() => get(formattedText)()]);
    append($$anchor, div);
    pop();
  }
  function normalizeStorefrontLanguageCode(locale, fallback = "EN") {
    if (!locale || typeof locale !== "string") return fallback;
    const normalized = locale.trim().replace(/_/g, "-").toLowerCase();
    if (!normalized) return fallback;
    const [lang, region] = normalized.split("-");
    if (!lang) return fallback;
    if (lang === "pt" && region === "br") return "PT_BR";
    if (lang === "pt" && region === "pt") return "PT_PT";
    if (lang === "zh" && region === "cn") return "ZH_CN";
    if (lang === "zh" && region === "tw") return "ZH_TW";
    return lang.toUpperCase();
  }
  async function fetchProductRecommendations(productId, intent, country, locale, storefrontToken, shop) {
    const query = `
    query ProductRecommendations(
      $productId: ID!
      $intent: ProductRecommendationIntent
      $country: CountryCode
      $locale: LanguageCode
    ) @inContext(country: $country, language: $locale) {
      productRecommendations(productId: $productId, intent: $intent) {
        id
        title
        handle
        onlineStoreUrl
        availableForSale
        featuredImage {
          transformedUrl: url(
            transform: { preferredContentType: WEBP, maxHeight: 200, maxWidth: 200 }
          )
        }
        options {
          name
          optionValues {
            name
          }
        }
        selectedOrFirstAvailableVariant {
          id
          availableForSale
          price {
            amount
          }
          compareAtPrice {
            amount
          }
          selectedOptions {
            name
            value
          }
          image {
            transformedUrl: url(
              transform: { preferredContentType: WEBP, maxHeight: 200, maxWidth: 200 }
            )
          }
          sellingPlanAllocations(first: 10) {
            nodes {
              sellingPlan {
                id
                name
                priceAdjustments {
                  adjustmentValue {
                    __typename
                    ... on SellingPlanFixedAmountPriceAdjustment {
                      adjustmentAmount {
                        amount
                      }
                    }
                    ... on SellingPlanPercentagePriceAdjustment {
                      adjustmentPercentage
                    }
                    ... on SellingPlanFixedPriceAdjustment {
                      price {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
    const variables = {
      productId,
      intent: intent.toUpperCase(),
      country: country?.toUpperCase() || "FR",
      locale: normalizeStorefrontLanguageCode(locale, "FR")
    };
    try {
      const url = shop ? `https://${shop}/api/2025-10/graphql.json` : "/api/2025-10/graphql.json";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": storefrontToken || ""
        },
        body: JSON.stringify({ query, variables })
      });
      const data = await response.json();
      return data.data?.productRecommendations ?? [];
    } catch (error) {
      console.error("Error fetching product recommendations:", error);
      return [];
    }
  }
  async function fetchUpsellVariantByOptions(productId, selectedOptions, country, locale, storefrontToken, shop) {
    const query = `
      query getVariantBySelectedOptions(
        $productId: ID!
        $country: CountryCode
        $locale: LanguageCode
        $selectedOptions: [SelectedOptionInput!]!
      ) @inContext(country: $country, language: $locale) {
        node(id: $productId) {
          ... on Product {
            variantBySelectedOptions(selectedOptions: $selectedOptions) {
              id
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                altText
                transformedUrl: url(
                  transform: {
                    preferredContentType: WEBP
                    maxHeight: 200
                    maxWidth: 200
                  }
                )
              }
            }
          }
        }
      }
    `;
    const variables = {
      productId,
      country: country?.toUpperCase() || "FR",
      locale: normalizeStorefrontLanguageCode(locale, "FR"),
      selectedOptions
    };
    try {
      const url = shop ? `https://${shop}/api/2025-10/graphql.json` : "/api/2025-10/graphql.json";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": storefrontToken || ""
        },
        body: JSON.stringify({ query, variables })
      });
      const data = await response.json();
      return data.data?.node?.variantBySelectedOptions;
    } catch (error) {
      console.error("Error fetching variant:", error);
      return null;
    }
  }
  function normalizeProductVariantGid(variantId) {
    if (variantId == null || typeof variantId !== "string") return void 0;
    const v = variantId.trim();
    if (!v) return void 0;
    if (v.startsWith("gid://shopify/ProductVariant/")) return v;
    if (/^\d+$/.test(v)) return `gid://shopify/ProductVariant/${v}`;
    return v;
  }
  function variantAvailabilityLookup(map, variantId) {
    if (!variantId) return void 0;
    if (Object.prototype.hasOwnProperty.call(map, variantId)) return map[variantId];
    const gid = normalizeProductVariantGid(variantId);
    if (gid && Object.prototype.hasOwnProperty.call(map, gid)) return map[gid];
    const tail = variantId.split("/").pop();
    if (tail && Object.prototype.hasOwnProperty.call(map, tail)) return map[tail];
    return void 0;
  }
  async function fetchProgressBarGiftImages(productIds, variantIds, storefrontToken, shop, country, locale) {
    const empty = {
      images: {},
      titles: {},
      variantAvailableForSale: {}
    };
    const normalizedVariantIds = (variantIds ?? []).map((id) => normalizeProductVariantGid(id) ?? String(id).trim()).filter(Boolean);
    const uniqueIds = [
      ...new Set([...productIds ?? [], ...normalizedVariantIds].filter(Boolean))
    ];
    if (uniqueIds.length === 0) return empty;
    const query = `
    query GiftProgressBarData(
      $ids: [ID!]!
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          featuredImage {
            transformedUrl: url(transform: { preferredContentType: WEBP, maxHeight: 400, maxWidth: 400 })
          }
        }
        ... on ProductVariant {
          id
          availableForSale
        }
      }
    }
  `;
    const variables = {
      ids: uniqueIds,
      country: (country && country.length >= 2 ? country.slice(0, 2) : "FR").toUpperCase(),
      language: normalizeStorefrontLanguageCode(locale, "FR")
    };
    try {
      const url = shop ? `https://${shop}/api/2025-10/graphql.json` : "/api/2025-10/graphql.json";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": storefrontToken
        },
        body: JSON.stringify({ query, variables })
      });
      const data = await response.json();
      const images = {};
      const titles = {};
      const variantAvailableForSale = {};
      for (const node of data.data?.nodes ?? []) {
        if (!node?.id) continue;
        if (typeof node.availableForSale === "boolean") {
          variantAvailableForSale[node.id] = node.availableForSale;
          const numericId = node.id.split("/").pop();
          if (numericId) {
            variantAvailableForSale[numericId] = node.availableForSale;
          }
          continue;
        }
        if (node?.featuredImage?.transformedUrl) {
          images[node.id] = node.featuredImage.transformedUrl;
        }
        if (node?.title) {
          titles[node.id] = node.title;
        }
      }
      return { images, titles, variantAvailableForSale };
    } catch {
      return empty;
    }
  }
  var root_2$d = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-center-wrap svelte-zsl9sh"><div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:13px;width:160px;"></div></div>`);
  var root_4$4 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-stack moonbundle-skeleton-stack--center svelte-zsl9sh"><div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:12px;width:55%;"></div> <div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:10px;width:100%;border-radius:99px;"></div></div>`);
  var root_6$4 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-el svelte-zsl9sh" style="width:100%;height:100px;border-radius:8px;"></div>`);
  var root_8$3 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-stack svelte-zsl9sh"><div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:13px;width:100%;"></div> <div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:13px;width:75%;"></div> <div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:13px;width:40%;"></div></div>`);
  var root_10$2 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-el svelte-zsl9sh" style="width:100%;height:70px;border-radius:8px;"></div>`);
  var root_13$4 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-item svelte-zsl9sh"><div class="moonbundle-skeleton-el svelte-zsl9sh" style="width:72px;height:72px;flex-shrink:0;border-radius:8px;"></div> <div class="moonbundle-skeleton-stack svelte-zsl9sh" style="flex:1;padding-top:4px;"><div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:13px;width:100%;"></div> <div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:13px;width:58%;"></div> <div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:28px;width:100px;border-radius:6px;margin-top:2px;"></div></div></div>`);
  var root_12$4 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-stack svelte-zsl9sh"></div>`);
  var root_15$3 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-upsell svelte-zsl9sh"><div class="moonbundle-skeleton-el svelte-zsl9sh" style="width:64px;height:64px;flex-shrink:0;border-radius:8px;"></div> <div class="moonbundle-skeleton-stack svelte-zsl9sh" style="flex:1;padding-top:4px;"><div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:13px;width:100%;"></div> <div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:13px;width:58%;"></div> <div class="moonbundle-skeleton-row svelte-zsl9sh" style="margin-top:4px;"><div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:18px;width:60px;border-radius:6px;"></div> <div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:32px;width:90px;border-radius:6px;"></div></div></div></div>`);
  var root_17$2 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-row svelte-zsl9sh"><div class="moonbundle-skeleton-el svelte-zsl9sh" style="width:40px;height:40px;flex-shrink:0;border-radius:6px;"></div> <div class="moonbundle-skeleton-el svelte-zsl9sh" style="flex:1;height:13px;"></div> <div class="moonbundle-skeleton-el svelte-zsl9sh" style="width:36px;height:20px;flex-shrink:0;border-radius:99px;"></div></div>`);
  var root_19$3 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-row svelte-zsl9sh"><div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:14px;width:80px;"></div> <div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:14px;width:60px;"></div></div>`);
  var root_21$2 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-row svelte-zsl9sh"><div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:13px;width:90px;"></div> <div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:13px;width:50px;"></div></div>`);
  var root_23$2 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:50px;width:100%;border-radius:8px;"></div>`);
  var root_25$3 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:40px;width:100%;border-radius:8px;opacity:0.6;"></div>`);
  var root_28$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-el svelte-zsl9sh" style="height:24px;width:36px;border-radius:4px;"></div>`);
  var root_27 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-row moonbundle-skeleton-row--center svelte-zsl9sh"></div>`);
  var root_30$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-el svelte-zsl9sh" style="width:100%;height:50px;border-radius:8px;"></div>`);
  var root$n = /* @__PURE__ */ from_html(`<div class="moonbundle-skeleton-body svelte-zsl9sh"></div> <div class="moonbundle-skeleton-footer svelte-zsl9sh"></div>`, 1);
  function CartSkeleton($$anchor, $$props) {
    let bodyPositions = prop($$props, "bodyPositions", 19, () => ["product"]), footerPositions = prop($$props, "footerPositions", 19, () => ["subtotal", "checkout"]), showTimer = prop($$props, "showTimer", 3, false), showProgressBar = prop($$props, "showProgressBar", 3, false), showUpsell = prop($$props, "showUpsell", 3, false), showBannerImage = prop($$props, "showBannerImage", 3, false), showAdditionalText = prop($$props, "showAdditionalText", 3, false), showToggleUpsell = prop($$props, "showToggleUpsell", 3, false), showSubtotal = prop($$props, "showSubtotal", 3, false), showDiscountLine = prop($$props, "showDiscountLine", 3, false), showSecondaryButton = prop($$props, "showSecondaryButton", 3, false), showPaymentMethods = prop($$props, "showPaymentMethods", 3, false), itemCount = prop($$props, "itemCount", 3, 1);
    const skeletonCount = Math.min(Math.max(itemCount(), 1), 4);
    var fragment = root$n();
    var div = first_child(fragment);
    each(div, 21, bodyPositions, index, ($$anchor2, section) => {
      var fragment_1 = comment();
      var node = first_child(fragment_1);
      {
        var consequent = ($$anchor3) => {
          var div_1 = root_2$d();
          append($$anchor3, div_1);
        };
        var alternate_5 = ($$anchor3) => {
          var fragment_2 = comment();
          var node_1 = first_child(fragment_2);
          {
            var consequent_1 = ($$anchor4) => {
              var div_2 = root_4$4();
              append($$anchor4, div_2);
            };
            var alternate_4 = ($$anchor4) => {
              var fragment_3 = comment();
              var node_2 = first_child(fragment_3);
              {
                var consequent_2 = ($$anchor5) => {
                  var div_3 = root_6$4();
                  append($$anchor5, div_3);
                };
                var alternate_3 = ($$anchor5) => {
                  var fragment_4 = comment();
                  var node_3 = first_child(fragment_4);
                  {
                    var consequent_3 = ($$anchor6) => {
                      var div_4 = root_8$3();
                      append($$anchor6, div_4);
                    };
                    var alternate_2 = ($$anchor6) => {
                      var fragment_5 = comment();
                      var node_4 = first_child(fragment_5);
                      {
                        var consequent_4 = ($$anchor7) => {
                          var div_5 = root_10$2();
                          append($$anchor7, div_5);
                        };
                        var alternate_1 = ($$anchor7) => {
                          var fragment_6 = comment();
                          var node_5 = first_child(fragment_6);
                          {
                            var consequent_5 = ($$anchor8) => {
                              var div_6 = root_12$4();
                              each(div_6, 21, () => Array(skeletonCount), index, ($$anchor9, _, i) => {
                                var div_7 = root_13$4();
                                set_style(div_7, `animation-delay:${i * 60}ms`);
                                append($$anchor9, div_7);
                              });
                              append($$anchor8, div_6);
                            };
                            var alternate = ($$anchor8) => {
                              var fragment_7 = comment();
                              var node_6 = first_child(fragment_7);
                              {
                                var consequent_6 = ($$anchor9) => {
                                  var div_8 = root_15$3();
                                  append($$anchor9, div_8);
                                };
                                if_block(
                                  node_6,
                                  ($$render) => {
                                    if (get(section) === "upsell" && showUpsell()) $$render(consequent_6);
                                  },
                                  true
                                );
                              }
                              append($$anchor8, fragment_7);
                            };
                            if_block(
                              node_5,
                              ($$render) => {
                                if (get(section) === "product") $$render(consequent_5);
                                else $$render(alternate, false);
                              },
                              true
                            );
                          }
                          append($$anchor7, fragment_6);
                        };
                        if_block(
                          node_4,
                          ($$render) => {
                            if (get(section).startsWith("customHtml-")) $$render(consequent_4);
                            else $$render(alternate_1, false);
                          },
                          true
                        );
                      }
                      append($$anchor6, fragment_5);
                    };
                    if_block(
                      node_3,
                      ($$render) => {
                        if (get(section) === "additionalText" && showAdditionalText()) $$render(consequent_3);
                        else $$render(alternate_2, false);
                      },
                      true
                    );
                  }
                  append($$anchor5, fragment_4);
                };
                if_block(
                  node_2,
                  ($$render) => {
                    if (get(section) === "bannerImage" && showBannerImage()) $$render(consequent_2);
                    else $$render(alternate_3, false);
                  },
                  true
                );
              }
              append($$anchor4, fragment_3);
            };
            if_block(
              node_1,
              ($$render) => {
                if (get(section) === "progressBar" && showProgressBar()) $$render(consequent_1);
                else $$render(alternate_4, false);
              },
              true
            );
          }
          append($$anchor3, fragment_2);
        };
        if_block(node, ($$render) => {
          if (get(section) === "timer" && showTimer()) $$render(consequent);
          else $$render(alternate_5, false);
        });
      }
      append($$anchor2, fragment_1);
    });
    var div_9 = sibling(div, 2);
    each(div_9, 21, footerPositions, index, ($$anchor2, section) => {
      var fragment_8 = comment();
      var node_7 = first_child(fragment_8);
      {
        var consequent_7 = ($$anchor3) => {
          var div_10 = root_17$2();
          append($$anchor3, div_10);
        };
        var alternate_11 = ($$anchor3) => {
          var fragment_9 = comment();
          var node_8 = first_child(fragment_9);
          {
            var consequent_8 = ($$anchor4) => {
              var div_11 = root_19$3();
              append($$anchor4, div_11);
            };
            var alternate_10 = ($$anchor4) => {
              var fragment_10 = comment();
              var node_9 = first_child(fragment_10);
              {
                var consequent_9 = ($$anchor5) => {
                  var div_12 = root_21$2();
                  append($$anchor5, div_12);
                };
                var alternate_9 = ($$anchor5) => {
                  var fragment_11 = comment();
                  var node_10 = first_child(fragment_11);
                  {
                    var consequent_10 = ($$anchor6) => {
                      var div_13 = root_23$2();
                      append($$anchor6, div_13);
                    };
                    var alternate_8 = ($$anchor6) => {
                      var fragment_12 = comment();
                      var node_11 = first_child(fragment_12);
                      {
                        var consequent_11 = ($$anchor7) => {
                          var div_14 = root_25$3();
                          append($$anchor7, div_14);
                        };
                        var alternate_7 = ($$anchor7) => {
                          var fragment_13 = comment();
                          var node_12 = first_child(fragment_13);
                          {
                            var consequent_12 = ($$anchor8) => {
                              var div_15 = root_27();
                              each(div_15, 20, () => Array(5), index, ($$anchor9, _) => {
                                var div_16 = root_28$1();
                                append($$anchor9, div_16);
                              });
                              append($$anchor8, div_15);
                            };
                            var alternate_6 = ($$anchor8) => {
                              var fragment_14 = comment();
                              var node_13 = first_child(fragment_14);
                              {
                                var consequent_13 = ($$anchor9) => {
                                  var div_17 = root_30$1();
                                  append($$anchor9, div_17);
                                };
                                if_block(
                                  node_13,
                                  ($$render) => {
                                    if (get(section).startsWith("customHtml-")) $$render(consequent_13);
                                  },
                                  true
                                );
                              }
                              append($$anchor8, fragment_14);
                            };
                            if_block(
                              node_12,
                              ($$render) => {
                                if (get(section) === "paymentMethods" && showPaymentMethods()) $$render(consequent_12);
                                else $$render(alternate_6, false);
                              },
                              true
                            );
                          }
                          append($$anchor7, fragment_13);
                        };
                        if_block(
                          node_11,
                          ($$render) => {
                            if (get(section) === "secondaryButton" && showSecondaryButton()) $$render(consequent_11);
                            else $$render(alternate_7, false);
                          },
                          true
                        );
                      }
                      append($$anchor6, fragment_12);
                    };
                    if_block(
                      node_10,
                      ($$render) => {
                        if (get(section) === "checkout") $$render(consequent_10);
                        else $$render(alternate_8, false);
                      },
                      true
                    );
                  }
                  append($$anchor5, fragment_11);
                };
                if_block(
                  node_9,
                  ($$render) => {
                    if (get(section) === "discountLine" && showDiscountLine()) $$render(consequent_9);
                    else $$render(alternate_9, false);
                  },
                  true
                );
              }
              append($$anchor4, fragment_10);
            };
            if_block(
              node_8,
              ($$render) => {
                if (get(section) === "subtotal" && showSubtotal()) $$render(consequent_8);
                else $$render(alternate_10, false);
              },
              true
            );
          }
          append($$anchor3, fragment_9);
        };
        if_block(node_7, ($$render) => {
          if (get(section) === "toggleUpsell" && showToggleUpsell()) $$render(consequent_7);
          else $$render(alternate_11, false);
        });
      }
      append($$anchor2, fragment_8);
    });
    append($$anchor, fragment);
  }
  var root$m = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-body-paragraph"><!></div>`);
  function CartAdditionalText($$anchor, $$props) {
    push($$props, true);
    let text2 = prop($$props, "text", 3, "");
    var div = root$m();
    var node = child(div);
    html(node, () => getTranslated("body.bodyParagraphText") || text2());
    append($$anchor, div);
    pop();
  }
  var root$l = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-body-container-banner-image"><img alt="Body banner" class="moonbundle-cart-body-banner-image"/></div>`);
  function CartBannerImage($$anchor, $$props) {
    let imageSrc = prop($$props, "imageSrc", 3, "");
    var div = root$l();
    var img = child(div);
    template_effect(() => set_attribute(img, "src", imageSrc()));
    append($$anchor, div);
  }
  function productVariantUrlFromOnlineStoreUrl(onlineStoreUrl, variantNumericId) {
    if (typeof onlineStoreUrl !== "string" || !onlineStoreUrl.trim() || !variantNumericId) {
      return void 0;
    }
    try {
      const u = new URL(onlineStoreUrl);
      u.searchParams.set("variant", String(variantNumericId));
      return u.href;
    } catch {
      return void 0;
    }
  }
  function lineItemProductLink(item) {
    const fromCart = item.url?.trim();
    if (fromCart) {
      if (/^https?:\/\//i.test(fromCart)) {
        return { href: fromCart, navigable: true };
      }
      const href = fromCart.startsWith("/") ? fromCart : `/${fromCart.replace(/^\/+/, "")}`;
      return { href, navigable: true };
    }
    const h = item.handle?.trim();
    if (h && item.variant_id) {
      return {
        href: `/products/${encodeURIComponent(h)}?variant=${item.variant_id}`,
        navigable: true
      };
    }
    return { href: "#", navigable: false };
  }
  function upsellProductLink(upsell) {
    const vid = upsell.variant_id;
    if (!vid) {
      return { href: "#", navigable: false };
    }
    const stored = upsell.url?.trim();
    if (stored) {
      try {
        if (stored.startsWith("http://") || stored.startsWith("https://")) {
          const u2 = new URL(stored);
          u2.searchParams.set("variant", String(vid));
          return { href: u2.href, navigable: true };
        }
        const u = new URL(stored, "https://example.com");
        u.searchParams.set("variant", String(vid));
        return { href: u.pathname + u.search, navigable: true };
      } catch {
        return { href: "#", navigable: false };
      }
    }
    const h = upsell.handle?.trim();
    if (h) {
      return {
        href: `/products/${encodeURIComponent(h)}?variant=${vid}`,
        navigable: true
      };
    }
    return { href: "#", navigable: false };
  }
  function stripHtmlTagsForDisplay(raw) {
    if (!raw) return "";
    return raw.replace(/&lt;\s*br\s*\/?&gt;/gi, " ").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, "").replace(/\s{2,}/g, " ").trim();
  }
  var root$k = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-item-quantity-container"><div class="moonbundle-cart-item-quantity"><button type="button" data-action="decrease" aria-label="decrease quantity"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="moonbundle-icon-minus" fill="none" viewBox="0 0 10 2"><path fill-rule="evenodd" clip-rule="evenodd" d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z" fill="currentColor"></path></svg> <div><div class="moonbundle-loading-overlay__spinner"><svg aria-hidden="true" focusable="false" class="moonbundle-spinner-rotator" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="moonbundle-circle-loader" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle></svg></div></div></button> <input type="number" class="moonbundle-quantity-input" min="1"/> <button type="button" data-action="increase" aria-label="increase quantity"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="moonbundle-icon-plus" fill="none" viewBox="0 0 10 10"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z" fill="currentColor"></path></svg> <div><div class="moonbundle-loading-overlay__spinner"><svg aria-hidden="true" focusable="false" class="moonbundle-spinner-rotator" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="moonbundle-circle-loader" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle></svg></div></div></button></div></div>`);
  function ItemQuantitySelector($$anchor, $$props) {
    push($$props, true);
    const decreaseDisabled = /* @__PURE__ */ user_derived(() => $$props.item.quantity <= 1);
    const increaseLoading = /* @__PURE__ */ user_derived(() => $$props.loadingItems.has(`increase-${$$props.item.key}`));
    const decreaseLoading = /* @__PURE__ */ user_derived(() => $$props.loadingItems.has(`decrease-${$$props.item.key}`));
    var div = root$k();
    var div_1 = child(div);
    var button = child(div_1);
    let classes;
    var div_2 = sibling(child(button), 2);
    let classes_1;
    var input = sibling(button, 2);
    var button_1 = sibling(input, 2);
    let classes_2;
    var div_3 = sibling(child(button_1), 2);
    let classes_3;
    template_effect(
      ($0, $1, $2, $3) => {
        classes = set_class(button, 1, "moonbundle-quantity-btn", null, classes, $0);
        set_attribute(button, "data-item-key", $$props.item.key);
        button.disabled = get(decreaseDisabled) || get(decreaseLoading);
        classes_1 = set_class(div_2, 1, "moonbundle-loading-overlay", null, classes_1, $1);
        set_attribute(input, "id", `cartDrawerInput-${$$props.index ?? ""}`);
        set_value(input, $$props.item.quantity);
        set_attribute(input, "data-item-key", $$props.item.key);
        classes_2 = set_class(button_1, 1, "moonbundle-quantity-btn", null, classes_2, $2);
        set_attribute(button_1, "data-item-key", $$props.item.key);
        button_1.disabled = get(increaseLoading);
        classes_3 = set_class(div_3, 1, "moonbundle-loading-overlay", null, classes_3, $3);
      },
      [
        () => ({
          disabled: get(decreaseDisabled),
          "hidden-minus": get(decreaseLoading)
        }),
        () => ({ "moonbundle-hidden": !get(decreaseLoading) }),
        () => ({ "hidden-plus": get(increaseLoading) }),
        () => ({ "moonbundle-hidden": !get(increaseLoading) })
      ]
    );
    append($$anchor, div);
    pop();
  }
  var root$j = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-item-remove-container"><button aria-label="remove item"><svg viewBox="0 0 20 20"><path d="M11.5 8.25a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0v-4.25a.75.75 0 0 1 .75-.75Z"></path><path d="M9.25 9a.75.75 0 0 0-1.5 0v4.25a.75.75 0 0 0 1.5 0v-4.25Z"></path><path fill-rule="evenodd" d="M7.25 5.25a2.75 2.75 0 0 1 5.5 0h3a.75.75 0 0 1 0 1.5h-.75v5.45c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327h-.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311c-.327-.642-.327-1.482-.327-3.162v-5.45h-.75a.75.75 0 0 1 0-1.5h3Zm1.5 0a1.25 1.25 0 1 1 2.5 0h-2.5Zm-2.25 1.5h7v5.45c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.128.633a1.5 1.5 0 0 1-.655.655c-.074.038-.225.095-.633.128-.425.035-.983.036-1.848.036h-.4c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.128a1.5 1.5 0 0 1-.656-.655c-.037-.074-.094-.225-.127-.633-.035-.425-.036-.983-.036-1.848v-5.45Z"></path></svg> <div><div class="moonbundle-loading-overlay__spinner"><svg aria-hidden="true" focusable="false" class="moonbundle-spinner-rotator" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="moonbundle-circle-loader" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle></svg></div></div></button></div>`);
  function ItemRemoveButton($$anchor, $$props) {
    push($$props, true);
    var div = root$j();
    var button = child(div);
    let classes;
    var svg = child(button);
    let classes_1;
    var div_1 = sibling(svg, 2);
    let classes_2;
    template_effect(
      ($0, $1, $2) => {
        classes = set_class(button, 1, "moonbundle-cart-item-remove", null, classes, $0);
        set_attribute(button, "data-item-key", $$props.item.key);
        classes_1 = set_class(svg, 0, "moonbundle-cart-item-remove-icon", null, classes_1, $1);
        classes_2 = set_class(div_1, 1, "moonbundle-loading-overlay", null, classes_2, $2);
      },
      [
        () => ({
          "hidden-remove": $$props.loadingItems.has(`remove-${$$props.item.key}`)
        }),
        () => ({
          "moonbundle-hidden": $$props.loadingItems.has(`remove-${$$props.item.key}`)
        }),
        () => ({
          "moonbundle-hidden": !$$props.loadingItems.has(`remove-${$$props.item.key}`)
        })
      ]
    );
    append($$anchor, div);
    pop();
  }
  var root_2$c = /* @__PURE__ */ from_html(`<span></span>`);
  var root_1$c = /* @__PURE__ */ from_html(`<div class="moonbundle-item-reviews"><div class="moonbundle-item-reviews__stars" role="img"></div> <span class="moonbundle-item-reviews__count"> </span></div>`);
  function ItemReviews($$anchor, $$props) {
    let shouldShow = /* @__PURE__ */ user_derived(() => typeof $$props.reviewRating === "number" && $$props.reviewRating > 0 && typeof $$props.reviewCount === "number" && $$props.reviewCount > 0);
    function getStarState(index2) {
      if (!get(shouldShow)) return "off";
      if (index2 < Math.floor($$props.reviewRating)) return "on";
      if (index2 < $$props.reviewRating) return "half";
      return "off";
    }
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root_1$c();
        var div_1 = child(div);
        each(div_1, 20, () => ({ length: 5 }), index, ($$anchor3, _, i) => {
          var span = root_2$c();
          template_effect(($0) => set_class(span, 1, `moonbundle-star moonbundle--${$0 ?? ""}`), [() => getStarState(i)]);
          append($$anchor3, span);
        });
        var span_1 = sibling(div_1, 2);
        var text2 = child(span_1);
        template_effect(() => {
          set_attribute(div_1, "aria-label", `Note : ${$$props.reviewRating ?? ""} sur 5`);
          set_text(text2, `(${$$props.reviewCount ?? ""})`);
        });
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (get(shouldShow)) $$render(consequent);
      });
    }
    append($$anchor, fragment);
  }
  var root_3$a = /* @__PURE__ */ from_html(`<label> </label>`);
  var root_5$8 = /* @__PURE__ */ from_html(`<option> </option>`);
  var root_6$3 = /* @__PURE__ */ from_html(`<option selected> </option>`);
  var root_2$b = /* @__PURE__ */ from_html(`<div class="moonbundle-product-form__input"><!> <div class="moonbundle-select"><select class="moonbundle-select__select"><!></select></div> <div class="moonbundle-product-form__error-message"></div></div>`);
  var root_1$b = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-container-alloptions"></div>`);
  function ItemVariantSelector($$anchor, $$props) {
    push($$props, true);
    let showTitleVariant = prop($$props, "showTitleVariant", 3, false);
    function optionCombinationCount(opts) {
      if (!opts.length) return 0;
      let n = 1;
      for (const o of opts) {
        const len = o.value?.length ?? 0;
        if (len === 0) return 0;
        n *= len;
      }
      return n;
    }
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent_2 = ($$anchor2) => {
        var div = root_1$b();
        each(div, 21, () => $$props.item.optionsValuesEnriched, index, ($$anchor3, option, optionIndex) => {
          var div_1 = root_2$b();
          var node_1 = child(div_1);
          {
            var consequent = ($$anchor4) => {
              var label = root_3$a();
              let classes;
              var text2 = child(label);
              template_effect(
                ($0) => {
                  classes = set_class(label, 1, "moonbundle-cart-form__label", null, classes, $0);
                  set_attribute(label, "for", `Option-${$$props.index ?? ""}-${optionIndex}`);
                  set_text(text2, get(option).name);
                },
                [
                  () => ({ disabled: $$props.isProgressBarGift($$props.item) })
                ]
              );
              append($$anchor4, label);
            };
            if_block(node_1, ($$render) => {
              if (showTitleVariant()) $$render(consequent);
            });
          }
          var div_2 = sibling(node_1, 2);
          var select = child(div_2);
          var node_2 = child(select);
          {
            var consequent_1 = ($$anchor4) => {
              var fragment_1 = comment();
              var node_3 = first_child(fragment_1);
              each(node_3, 17, () => get(option).value, index, ($$anchor5, value) => {
                var option_1 = root_5$8();
                var text_1 = child(option_1);
                var option_1_value = {};
                template_effect(
                  ($0) => {
                    set_selected(option_1, $0);
                    set_text(text_1, get(value));
                    if (option_1_value !== (option_1_value = get(value))) {
                      option_1.value = (option_1.__value = get(value)) ?? "";
                    }
                  },
                  [
                    () => $$props.item.options_with_values?.find((opt) => opt.name === get(option).name)?.value === get(value)
                  ]
                );
                append($$anchor5, option_1);
              });
              append($$anchor4, fragment_1);
            };
            var alternate = ($$anchor4) => {
              var option_2 = root_6$3();
              const sole = /* @__PURE__ */ user_derived(() => $$props.item.options_with_values?.find((opt) => opt.name === get(option).name)?.value ?? get(option).value[0] ?? "");
              var text_2 = child(option_2);
              var option_2_value = {};
              template_effect(() => {
                set_text(text_2, get(sole));
                if (option_2_value !== (option_2_value = get(sole))) {
                  option_2.value = (option_2.__value = get(sole)) ?? "";
                }
              });
              append($$anchor4, option_2);
            };
            if_block(node_2, ($$render) => {
              if (get(option).value && get(option).value.length > 1) $$render(consequent_1);
              else $$render(alternate, false);
            });
          }
          template_effect(
            ($0) => {
              set_attribute(select, "id", `Option-${$$props.index ?? ""}-${optionIndex}`);
              set_attribute(select, "name", `options[${get(option).name ?? ""}]`);
              set_attribute(select, "data-item-key", $$props.item.key);
              set_attribute(select, "data-option-name", get(option).name);
              set_attribute(select, "data-product-id", $$props.item.productId || "");
              set_attribute(select, "data-id-merchandise-line", $$props.item.idMerchandiseLine || "");
              set_attribute(select, "data-option-id", get(option).id || "");
              select.disabled = $0;
            },
            [() => $$props.isProgressBarGift($$props.item)]
          );
          append($$anchor3, div_1);
        });
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if ($$props.item.optionsValuesEnriched?.length && optionCombinationCount($$props.item.optionsValuesEnriched) > 1) $$render(consequent_2);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  function onProductLinkClick$1(e, productLink) {
    if (!get(productLink).navigable) e.preventDefault();
  }
  var root_3$9 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-item-property"><span class="moonbundle-cart-item-property-key"> </span> <span class="moonbundle-cart-item-property-value"> </span></div>`);
  var root_5$7 = /* @__PURE__ */ from_html(`<span class="moonbundle-cart-item-property-key"> </span>`);
  var root_4$3 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-item-property"><!> <span class="moonbundle-cart-item-property-value"> </span></div>`);
  var root_2$a = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-item-properties"><!> <!></div>`);
  var root_12$3 = /* @__PURE__ */ from_html(` <!>`, 1);
  var root_11$2 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-form__label"><!>:</div>`);
  var root_14$2 = /* @__PURE__ */ from_html(` <!>`, 1);
  var root_10$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-product-options"><!> <div class="moonbundle-product-options-values"></div></div>`);
  var root_19$2 = /* @__PURE__ */ from_svg(`<svg class="icon icon-discount" viewBox="0 0 12 12"><path fill="currentColor" fill-rule="evenodd" d="M7 0h3a2 2 0 0 1 2 2v3a1 1 0 0 1-.3.7l-6 6a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4l6-6A1 1 0 0 1 7 0m2 2a1 1 0 1 0 2 0 1 1 0 0 0-2 0" clip-rule="evenodd"></path></svg>`);
  var root_18$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-free-gift-badge"><!> <span> </span></div>`);
  var root$i = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-item-details"><h4 class="moonbundle-cart-item-title"><!> <a> </a></h4> <!> <!> <!> <div class="moonbundle-cart-containerQuantityAndDeleteBtn"><!> <!></div> <!></div>`);
  function ItemDetails($$anchor, $$props) {
    push($$props, true);
    const productLink = /* @__PURE__ */ user_derived(() => lineItemProductLink($$props.item));
    const visibleProperties = /* @__PURE__ */ user_derived(() => Object.entries($$props.item.properties ?? {}).filter(([k]) => !k.startsWith("_")));
    const cartSubscriptionLines = /* @__PURE__ */ user_derived(() => {
      const plan = $$props.item.selling_plan_allocation?.selling_plan;
      if (!plan) return [];
      const planName = plan.name?.trim();
      if (planName) {
        return [{ value: planName }];
      }
      return (plan.options ?? []).map((option) => {
        const key2 = option.name?.trim();
        const value = option.value?.trim();
        if (!value) return null;
        return key2 ? { key: key2, value } : { value };
      }).filter((line) => line !== null);
    });
    var div = root$i();
    var h4 = child(div);
    var node = child(h4);
    {
      var consequent = ($$anchor2) => {
        var text$1 = text();
        template_effect(() => set_text(text$1, `${$$props.item.quantity ?? ""}x`));
        append($$anchor2, text$1);
      };
      if_block(node, ($$render) => {
        if ($$props.item.quantity > 1 && ($$props.isProgressBarGift($$props.item) || !$$props.cartDrawerProps?.lineProductCart?.showQuantitySelector)) $$render(consequent);
      });
    }
    var a = sibling(node, 2);
    let classes;
    a.__click = [onProductLinkClick$1, productLink];
    var text_1 = child(a);
    var node_1 = sibling(h4, 2);
    {
      var consequent_2 = ($$anchor2) => {
        var div_1 = root_2$a();
        var node_2 = child(div_1);
        each(node_2, 17, () => get(visibleProperties), index, ($$anchor3, $$item) => {
          var $$array = /* @__PURE__ */ user_derived(() => to_array(get($$item), 2));
          let key2 = () => get($$array)[0];
          let value = () => get($$array)[1];
          var div_2 = root_3$9();
          var span = child(div_2);
          var text_2 = child(span);
          var span_1 = sibling(span, 2);
          var text_3 = child(span_1);
          template_effect(() => {
            set_text(text_2, `${key2() ?? ""}:`);
            set_text(text_3, value());
          });
          append($$anchor3, div_2);
        });
        var node_3 = sibling(node_2, 2);
        each(node_3, 17, () => get(cartSubscriptionLines), index, ($$anchor3, line) => {
          var div_3 = root_4$3();
          var node_4 = child(div_3);
          {
            var consequent_1 = ($$anchor4) => {
              var span_2 = root_5$7();
              var text_4 = child(span_2);
              template_effect(() => set_text(text_4, `${get(line).key ?? ""}:`));
              append($$anchor4, span_2);
            };
            if_block(node_4, ($$render) => {
              if (get(line).key) $$render(consequent_1);
            });
          }
          var span_3 = sibling(node_4, 2);
          var text_5 = child(span_3);
          template_effect(() => set_text(text_5, get(line).value));
          append($$anchor3, div_3);
        });
        append($$anchor2, div_1);
      };
      if_block(node_1, ($$render) => {
        if ($$props.cartDrawerProps?.lineProductCart?.showLineProperties && (get(visibleProperties).length > 0 || get(cartSubscriptionLines).length > 0)) $$render(consequent_2);
      });
    }
    var node_5 = sibling(node_1, 2);
    {
      var consequent_3 = ($$anchor2) => {
        ItemReviews($$anchor2, {
          get reviewRating() {
            return $$props.item.reviewRating;
          },
          get reviewCount() {
            return $$props.item.reviewCount;
          }
        });
      };
      if_block(node_5, ($$render) => {
        if ($$props.cartDrawerProps?.lineProductCart?.showProductReviews) $$render(consequent_3);
      });
    }
    var node_6 = sibling(node_5, 2);
    {
      var consequent_4 = ($$anchor2) => {
        {
          let $0 = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.lineProductCart?.showTitleVariant ?? false);
          ItemVariantSelector($$anchor2, {
            get item() {
              return $$props.item;
            },
            get index() {
              return $$props.index;
            },
            get isProgressBarGift() {
              return $$props.isProgressBarGift;
            },
            get showTitleVariant() {
              return get($0);
            }
          });
        }
      };
      var alternate = ($$anchor2) => {
        var fragment_3 = comment();
        var node_7 = first_child(fragment_3);
        {
          var consequent_9 = ($$anchor3) => {
            var fragment_4 = comment();
            var node_8 = first_child(fragment_4);
            {
              var consequent_8 = ($$anchor4) => {
                var div_4 = root_10$1();
                var node_9 = child(div_4);
                {
                  var consequent_6 = ($$anchor5) => {
                    var div_5 = root_11$2();
                    var node_10 = child(div_5);
                    each(node_10, 17, () => $$props.item.options_with_values, index, ($$anchor6, option, idx) => {
                      var fragment_5 = root_12$3();
                      var text_6 = first_child(fragment_5);
                      var node_11 = sibling(text_6);
                      {
                        var consequent_5 = ($$anchor7) => {
                          var text_7 = text(", ");
                          append($$anchor7, text_7);
                        };
                        if_block(node_11, ($$render) => {
                          if (idx < $$props.item.options_with_values.length - 1) $$render(consequent_5);
                        });
                      }
                      template_effect(() => set_text(text_6, get(option).name));
                      append($$anchor6, fragment_5);
                    });
                    append($$anchor5, div_5);
                  };
                  if_block(node_9, ($$render) => {
                    if ($$props.cartDrawerProps?.lineProductCart?.showTitleVariant ?? false) $$render(consequent_6);
                  });
                }
                var div_6 = sibling(node_9, 2);
                each(div_6, 21, () => $$props.item.options_with_values, index, ($$anchor5, option, idx) => {
                  var fragment_6 = root_14$2();
                  var text_8 = first_child(fragment_6);
                  var node_12 = sibling(text_8);
                  {
                    var consequent_7 = ($$anchor6) => {
                      var text_9 = text(", ");
                      append($$anchor6, text_9);
                    };
                    if_block(node_12, ($$render) => {
                      if (idx < $$props.item.options_with_values.length - 1) $$render(consequent_7);
                    });
                  }
                  template_effect(() => set_text(text_8, get(option).value));
                  append($$anchor5, fragment_6);
                });
                append($$anchor4, div_4);
              };
              if_block(node_8, ($$render) => {
                if ($$props.item.options_with_values && $$props.item.options_with_values.length > 0) $$render(consequent_8);
              });
            }
            append($$anchor3, fragment_4);
          };
          if_block(
            node_7,
            ($$render) => {
              if (!$$props.item.product_has_only_default_variant) $$render(consequent_9);
            },
            true
          );
        }
        append($$anchor2, fragment_3);
      };
      if_block(node_6, ($$render) => {
        if ($$props.cartDrawerProps?.lineProductCart?.showVariantSelector && !$$props.item.product_has_only_default_variant) $$render(consequent_4);
        else $$render(alternate, false);
      });
    }
    var div_7 = sibling(node_6, 2);
    var node_13 = child(div_7);
    {
      var consequent_10 = ($$anchor2) => {
        ItemQuantitySelector($$anchor2, {
          get item() {
            return $$props.item;
          },
          get index() {
            return $$props.index;
          },
          get loadingItems() {
            return $$props.loadingItems;
          }
        });
      };
      if_block(node_13, ($$render) => {
        if (!$$props.isProgressBarGift($$props.item) && $$props.cartDrawerProps?.lineProductCart?.showQuantitySelector) $$render(consequent_10);
      });
    }
    var node_14 = sibling(node_13, 2);
    {
      var consequent_11 = ($$anchor2) => {
        ItemRemoveButton($$anchor2, {
          get item() {
            return $$props.item;
          },
          get loadingItems() {
            return $$props.loadingItems;
          }
        });
      };
      if_block(node_14, ($$render) => {
        if (!$$props.isProgressBarGift($$props.item) && $$props.cartDrawerProps?.lineProductCart?.showQuantitySelector) $$render(consequent_11);
      });
    }
    var node_15 = sibling(div_7, 2);
    {
      var consequent_13 = ($$anchor2) => {
        var div_8 = root_18$1();
        var node_16 = child(div_8);
        {
          var consequent_12 = ($$anchor3) => {
            var svg = root_19$2();
            append($$anchor3, svg);
          };
          if_block(node_16, ($$render) => {
            if ($$props.cartDrawerProps?.lineProductCart?.showIconIfFreeGift) $$render(consequent_12);
          });
        }
        var span_4 = sibling(node_16, 2);
        var text_10 = child(span_4);
        template_effect(($0) => set_text(text_10, $0), [
          () => stripHtmlTagsForDisplay($$props.item.discounts[0].title)
        ]);
        append($$anchor2, div_8);
      };
      if_block(node_15, ($$render) => {
        if ($$props.cartDrawerProps?.lineProductCart?.showDiscountLabel && $$props.item.discounts && $$props.item.discounts.length > 0) $$render(consequent_13);
      });
    }
    template_effect(
      ($0) => {
        classes = set_class(a, 1, "moonbundle-cart-item-title-link", null, classes, $0);
        set_attribute(a, "href", get(productLink).href);
        set_attribute(a, "aria-disabled", !get(productLink).navigable);
        set_text(text_1, $$props.item.product_title);
      },
      [
        () => ({
          "moonbundle-cart-link--non-navigable": !get(productLink).navigable
        })
      ]
    );
    append($$anchor, div);
    pop();
  }
  delegate(["click"]);
  function onProductLinkClick(e, productLink) {
    if (!get(productLink).navigable) e.preventDefault();
  }
  var root$h = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-item-image-container"><a><img class="moonbundle-cart-item-image"/></a></div>`);
  function ItemImage($$anchor, $$props) {
    push($$props, true);
    const productLink = /* @__PURE__ */ user_derived(() => lineItemProductLink($$props.item));
    var div = root$h();
    var a = child(div);
    let classes;
    a.__click = [onProductLinkClick, productLink];
    var img = child(a);
    template_effect(
      ($0) => {
        classes = set_class(a, 1, "moonbundle-cart-item-image-link", null, classes, $0);
        set_attribute(a, "href", get(productLink).href);
        set_attribute(a, "aria-disabled", !get(productLink).navigable);
        set_attribute(img, "src", $$props.item.image);
        set_attribute(img, "alt", $$props.item.product_title ?? "");
      },
      [
        () => ({
          "moonbundle-cart-link--non-navigable": !get(productLink).navigable
        })
      ]
    );
    append($$anchor, div);
    pop();
  }
  delegate(["click"]);
  var root_1$a = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-item-price"><!></p>`);
  var root_2$9 = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-item-original-price"><!></p>`);
  var root_3$8 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-item-gift-icon"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="16px" width="16px" version="1.1" viewBox="0 0 512 512" xml:space="preserve"><path fill="currentColor" d="M490.106,137.406L490.106,137.406v-0.242h-45.875l-39.078-0.203c34.246-20.972,49.528-61.605,34.324-95.004   C427.823,16.356,400.487,0,371.511,0c-12.289,0-24.869,2.942-36.678,9.363c-26.028,14.16-46.121,34.028-61.506,54.223   c-0.248,0.324-0.5,0.64-0.746,0.969c-2.365,3.137-4.602,6.258-6.738,9.383c-0.871,1.262-1.75,2.508-2.606,3.793   c-0.89,1.356-1.711,2.684-2.56,4.031c-1.588,2.473-3.205,4.898-4.742,7.465c-16.336-27.84-41.621-59.652-78.767-79.863   C165.358,2.942,152.776,0,140.489,0c-28.976,0-56.314,16.356-67.967,41.957c-12.68,27.855-4.111,60.707,18.932,83.027   c4.561,4.492,9.666,8.609,15.348,12.18H22.478h-0.346l0,0h-0.238v112.969c0,2.195,1.777,3.973,3.971,3.973H78.97v202.051   C78.97,487,103.972,512,134.812,512h81.188h80h81.187c30.84,0,55.842-25,55.842-55.844V254.274v-0.168h53.107   c2.192,0,3.971-1.778,3.971-3.973v-112.5V137.406z M116.208,61.844C119.86,53.82,130.073,48,140.491,48   c4.812,0,9.432,1.188,13.736,3.527c22.826,12.422,40.041,31.316,52.598,49.789c1.92,2.883,3.805,5.848,5.637,8.922   c-4.477,0.297-9.115,0.469-13.877,0.469c-23.496,0-44.367-4.074-62.035-12.117c-8.938-4.07-16.092-11.028-19.627-19.09   C115.319,75.844,113.093,68.688,116.208,61.844z M215.999,480h-81.188c-13.144,0-23.842-10.695-23.842-23.844V258.734h105.03   v221.055V480z M53.894,222.106v-52.942h162.106v52.942H54.312H53.894z M371.511,48c10.418,0,20.629,5.82,24.279,13.844   c3.115,6.844,0.891,14-0.713,17.656c-3.537,8.062-10.69,15.02-19.629,19.09c-17.666,8.043-38.537,12.117-62.035,12.117   c-4.207,0-8.276-0.18-12.268-0.414c-0.562-0.062-1.127-0.082-1.69-0.16c12.852-21.07,31.816-44.188,58.316-58.606   C362.075,49.188,366.698,48,371.511,48z M295.999,480V258.734h105.029v197.422c0,13.148-10.695,23.844-23.842,23.844h-81.098   H295.999z M295.999,222.106v-52.942h162.107v52.942H296.419H295.999z"></path></svg></div>`);
  var root_5$6 = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-item-discount"><!></p>`);
  var root$g = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-item-price-container"><div class="moonbundle-cart-item-prices"><!> <!></div> <!> <!></div>`);
  function ItemPricing($$anchor, $$props) {
    push($$props, true);
    const lp = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.lineProductCart);
    const freeLinePriceFallback = /* @__PURE__ */ user_derived(() => $$props.item.final_line_price === 0 && !get(lp)?.showZeroIfFreeGift && !get(lp)?.showIconIfFreeGift);
    const showMainLinePrice = /* @__PURE__ */ user_derived(() => $$props.item.final_line_price !== 0 || get(lp)?.showZeroIfFreeGift || get(freeLinePriceFallback));
    var div = root$g();
    var div_1 = child(div);
    var node = child(div_1);
    {
      var consequent = ($$anchor2) => {
        var p = root_1$a();
        var node_1 = child(p);
        html(node_1, () => $$props.shopifyFormatCurrency($$props.item.final_line_price));
        append($$anchor2, p);
      };
      if_block(node, ($$render) => {
        if (get(showMainLinePrice)) $$render(consequent);
      });
    }
    var node_2 = sibling(node, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var p_1 = root_2$9();
        var node_3 = child(p_1);
        html(node_3, () => $$props.shopifyFormatCurrency($$props.getItemOriginalPrice($$props.item)));
        append($$anchor2, p_1);
      };
      if_block(node_2, ($$render) => {
        if ($$props.getItemOriginalPrice($$props.item) > $$props.item.final_line_price) $$render(consequent_1);
      });
    }
    var node_4 = sibling(div_1, 2);
    {
      var consequent_2 = ($$anchor2) => {
        var div_2 = root_3$8();
        append($$anchor2, div_2);
      };
      var alternate = ($$anchor2) => {
        var fragment = comment();
        var node_5 = first_child(fragment);
        {
          var consequent_3 = ($$anchor3) => {
            var p_2 = root_5$6();
            const discountFormatted = /* @__PURE__ */ user_derived(() => $$props.shopifyFormatCurrency($$props.calculateItemDiscount($$props.item)));
            const textDiscountOffProcessed = /* @__PURE__ */ user_derived(() => hasDynamicVariable($$props.textDiscountOff, "discount_amount") ? replaceDynamicVariable($$props.textDiscountOff, "discount_amount", get(discountFormatted)) : `${get(discountFormatted)} ${$$props.textDiscountOff}`);
            var node_6 = child(p_2);
            html(node_6, () => get(textDiscountOffProcessed));
            append($$anchor3, p_2);
          };
          if_block(
            node_5,
            ($$render) => {
              if (!$$props.isProgressBarGift($$props.item) && $$props.cartDrawerProps?.lineProductCart?.showDiscountBubble && $$props.calculateItemDiscount($$props.item) > 0) $$render(consequent_3);
            },
            true
          );
        }
        append($$anchor2, fragment);
      };
      if_block(node_4, ($$render) => {
        if ($$props.cartDrawerProps?.lineProductCart?.showIconIfFreeGift && $$props.item.final_line_price === 0) $$render(consequent_2);
        else $$render(alternate, false);
      });
    }
    var node_7 = sibling(node_4, 2);
    {
      var consequent_4 = ($$anchor2) => {
        ItemRemoveButton($$anchor2, {
          get item() {
            return $$props.item;
          },
          get loadingItems() {
            return $$props.loadingItems;
          }
        });
      };
      if_block(node_7, ($$render) => {
        if (!$$props.isProgressBarGift($$props.item) && !$$props.cartDrawerProps?.lineProductCart?.showQuantitySelector) $$render(consequent_4);
      });
    }
    append($$anchor, div);
    pop();
  }
  var on_change$2 = (e, $$props) => $$props.handleSubscriptionToggle(e, $$props.item.key, $$props.item.quantity);
  var root_2$8 = /* @__PURE__ */ from_html(`<div class="moonbundle-subscribe-savings"> <!></div>`);
  var on_change_1$1 = (e, $$props) => $$props.handleSubscriptionChange(e, $$props.item.key, $$props.item.quantity);
  var root_5$5 = /* @__PURE__ */ from_html(`<option> </option>`);
  var root_3$7 = /* @__PURE__ */ from_html(`<div class="moonbundle-frequency-dropdown"><select class="moonbundle-frequency-select"></select></div>`);
  var root_1$9 = /* @__PURE__ */ from_html(`<div class="moonbundle-subscribe-save-section"><div class="moonbundle-subscribe-save-header"><div class="moonbundle-subscribe-save-checkbox-container"><input type="checkbox" class="moonbundle-subscribe-checkbox"/> <label class="moonbundle-subscribe-label"><span class="moonbundle-subscribe-title"> </span> <span class="moonbundle-subscribe-subtitle"> </span></label></div> <!></div> <div class="moonbundle-subscribe-frequency"><!></div></div>`);
  function ItemSubscription($$anchor, $$props) {
    push($$props, true);
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent_2 = ($$anchor2) => {
        var div = root_1$9();
        var div_1 = child(div);
        var div_2 = child(div_1);
        var input = child(div_2);
        input.__change = [on_change$2, $$props];
        var label = sibling(input, 2);
        var span = child(label);
        var text2 = child(span);
        var span_1 = sibling(span, 2);
        var text_1 = child(span_1);
        var node_1 = sibling(div_2, 2);
        {
          var consequent = ($$anchor3) => {
            var div_3 = root_2$8();
            var text_2 = child(div_3);
            var node_2 = sibling(text_2);
            html(node_2, () => $$props.shopifyFormatCurrency($$props.calculateItemDiscount($$props.item)));
            template_effect(() => set_text(text_2, `${$$props.textDiscountSub ?? ""}  `));
            append($$anchor3, div_3);
          };
          if_block(node_1, ($$render) => {
            if ($$props.calculateItemDiscount($$props.item) > 0) $$render(consequent);
          });
        }
        var div_4 = sibling(div_1, 2);
        var node_3 = child(div_4);
        {
          var consequent_1 = ($$anchor3) => {
            var div_5 = root_3$7();
            var select = child(div_5);
            select.__change = [on_change_1$1, $$props];
            each(select, 21, () => $$props.item.subscriptionData, index, ($$anchor4, subscriptionGroup) => {
              var fragment_1 = comment();
              var node_4 = first_child(fragment_1);
              each(node_4, 17, () => get(subscriptionGroup).sellingPlans, index, ($$anchor5, sellingPlan) => {
                var option = root_5$5();
                var text_3 = child(option);
                var option_value = {};
                template_effect(() => {
                  set_selected(option, $$props.item.selling_plan_allocation?.selling_plan?.id === get(sellingPlan).id);
                  set_text(text_3, get(sellingPlan).name);
                  if (option_value !== (option_value = get(sellingPlan).id)) {
                    option.value = (option.__value = get(sellingPlan).id) ?? "";
                  }
                });
                append($$anchor5, option);
              });
              append($$anchor4, fragment_1);
            });
            template_effect(() => {
              set_attribute(select, "data-item-key", $$props.item.key);
              set_attribute(select, "data-selling-plan-id", $$props.item.selling_plan_allocation?.selling_plan?.id);
              set_attribute(select, "id", `moonbundle-frequency-select-${$$props.index ?? ""}`);
            });
            append($$anchor3, div_5);
          };
          if_block(node_3, ($$render) => {
            if ($$props.item.subscriptionData && $$props.item.subscriptionData.reduce((sum, group) => sum + (group && group.sellingPlans && group.sellingPlans.length || 0), 0) > 1) $$render(consequent_1);
          });
        }
        template_effect(
          ($0, $1) => {
            set_attribute(input, "id", `subscribe-${$$props.index ?? ""}`);
            set_checked(input, $$props.item.selling_plan_allocation ? true : false);
            set_value(input, $$props.item.selling_plan_allocation?.selling_plan?.id || "");
            set_attribute(input, "data-item-key", $$props.item.key);
            set_attribute(label, "for", `subscribe-${$$props.index ?? ""}`);
            set_text(text2, $0);
            set_text(text_1, $1);
          },
          [
            () => getTranslated("lineProduct.textSaveAndSub") || $$props.cartDrawerProps?.lineProductCart?.textSaveAndSub,
            () => $$props.getSubtitleWithDiscount($$props.item)
          ]
        );
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if ($$props.item.subscriptionData && $$props.item.subscriptionData.length > 0) $$render(consequent_2);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["change"]);
  var root$f = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-item"><div class="moonbundle-cart-item-container"><!> <!> <!></div> <!></div>`);
  function CartItem($$anchor, $$props) {
    push($$props, true);
    var div = root$f();
    var div_1 = child(div);
    var node = child(div_1);
    ItemImage(node, {
      get item() {
        return $$props.item;
      }
    });
    var node_1 = sibling(node, 2);
    {
      let $0 = /* @__PURE__ */ user_derived(() => getTranslated("global.freeGift") || $$props.textFreeGift);
      ItemDetails(node_1, {
        get item() {
          return $$props.item;
        },
        get index() {
          return $$props.index;
        },
        get cartDrawerProps() {
          return $$props.cartDrawerProps;
        },
        get loadingItems() {
          return $$props.loadingItems;
        },
        get isProgressBarGift() {
          return $$props.isProgressBarGift;
        },
        get textFreeGift() {
          return get($0);
        }
      });
    }
    var node_2 = sibling(node_1, 2);
    {
      let $0 = /* @__PURE__ */ user_derived(() => getTranslated("global.textOffDiscount") || $$props.textDiscountOff);
      ItemPricing(node_2, {
        get item() {
          return $$props.item;
        },
        get cartDrawerProps() {
          return $$props.cartDrawerProps;
        },
        get loadingItems() {
          return $$props.loadingItems;
        },
        get isProgressBarGift() {
          return $$props.isProgressBarGift;
        },
        get shopifyFormatCurrency() {
          return $$props.shopifyFormatCurrency;
        },
        get getItemOriginalPrice() {
          return $$props.getItemOriginalPrice;
        },
        get calculateItemDiscount() {
          return $$props.calculateItemDiscount;
        },
        get textDiscountOff() {
          return get($0);
        }
      });
    }
    var node_3 = sibling(div_1, 2);
    {
      var consequent = ($$anchor2) => {
        {
          let $0 = /* @__PURE__ */ user_derived(() => getTranslated("lineProduct.textDiscountSub") || $$props.textDiscountSub);
          ItemSubscription($$anchor2, {
            get item() {
              return $$props.item;
            },
            get index() {
              return $$props.index;
            },
            get cartDrawerProps() {
              return $$props.cartDrawerProps;
            },
            get shopifyFormatCurrency() {
              return $$props.shopifyFormatCurrency;
            },
            get calculateItemDiscount() {
              return $$props.calculateItemDiscount;
            },
            get getSubtitleWithDiscount() {
              return $$props.getSubtitleWithDiscount;
            },
            get textDiscountSub() {
              return get($0);
            },
            get handleSubscriptionToggle() {
              return $$props.handleSubscriptionToggle;
            },
            get handleSubscriptionChange() {
              return $$props.handleSubscriptionChange;
            }
          });
        }
      };
      if_block(node_3, ($$render) => {
        if ($$props.cartDrawerProps?.lineProductCart?.isSubscriptionActive) $$render(consequent);
      });
    }
    template_effect(() => {
      set_attribute(div, "id", `CartDrawer-Item-${$$props.index ?? ""}`);
      set_attribute(div, "data-item-key", $$props.item.key);
    });
    append($$anchor, div);
    pop();
  }
  var root$e = /* @__PURE__ */ from_html(`<div id="moonbundle-cart-items"></div>`);
  function CartItems($$anchor, $$props) {
    var div = root$e();
    let classes;
    each(div, 23, () => $$props.filteredItems, (item) => item.key, ($$anchor2, item, index2) => {
      CartItem($$anchor2, {
        get item() {
          return get(item);
        },
        get index() {
          return get(index2);
        },
        get cartDrawerProps() {
          return $$props.cartDrawerProps;
        },
        get loadingItems() {
          return $$props.loadingItems;
        },
        get isProgressBarGift() {
          return $$props.isProgressBarGift;
        },
        get shopifyFormatCurrency() {
          return $$props.shopifyFormatCurrency;
        },
        get getItemOriginalPrice() {
          return $$props.getItemOriginalPrice;
        },
        get calculateItemDiscount() {
          return $$props.calculateItemDiscount;
        },
        get getSubtitleWithDiscount() {
          return $$props.getSubtitleWithDiscount;
        },
        get textDiscountSub() {
          return $$props.textDiscountSub;
        },
        get textDiscountOff() {
          return $$props.textDiscountOff;
        },
        get textFreeGift() {
          return $$props.textFreeGift;
        },
        get handleSubscriptionToggle() {
          return $$props.handleSubscriptionToggle;
        },
        get handleSubscriptionChange() {
          return $$props.handleSubscriptionChange;
        }
      });
    });
    template_effect(($0) => classes = set_class(div, 1, "moonbundle-cart-drawer-items", null, classes, $0), [() => ({ disabled: $$props.cartDisabled })]);
    append($$anchor, div);
  }
  var root$d = /* @__PURE__ */ from_html(`<div><div class="moonbundle-cart-progress-bar-connector-fill"></div></div>`);
  function ProgressConnector($$anchor, $$props) {
    let active = prop($$props, "active", 3, false), progressPercentage = prop($$props, "progressPercentage", 3, 0), isFirst = prop($$props, "isFirst", 3, false);
    var div = root$d();
    let classes;
    var div_1 = child(div);
    template_effect(
      ($0) => {
        classes = set_class(div, 1, "moonbundle-cart-progress-bar-connector", null, classes, $0);
        set_style(div_1, `width: ${progressPercentage() ?? ""}%`);
      },
      [() => ({ active: active(), first: isFirst() })]
    );
    append($$anchor, div);
  }
  var root_3$6 = /* @__PURE__ */ from_html(`<span class="moonbundle-cart-progress-bar-sold-out-label"> </span>`);
  var root_2$7 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-progress-bar-segment-image-wrapper"><img/> <!></div>`);
  var root_6$2 = /* @__PURE__ */ from_html(`<span class="moonbundle-cart-progress-bar-sold-out-label"> </span>`);
  var root_5$4 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-progress-bar-segment-image-wrapper"><img/> <!></div>`);
  var root_9$2 = /* @__PURE__ */ from_html(`<span class="moonbundle-cart-progress-bar-sold-out-label"> </span>`);
  var root_8$2 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-progress-bar-segment-image-wrapper"><div class="moonbundle-cart-progress-bar-segment-icon product-image-placeholder"></div> <!></div>`);
  var root_12$2 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-progress-bar-segment-image-wrapper"><span><!></span> <span class="moonbundle-cart-progress-bar-sold-out-label"> </span></div>`);
  var root_13$3 = /* @__PURE__ */ from_html(`<span><!></span>`);
  var root_16$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-progress-bar-segment-image-wrapper"><svg class="moonbundle-cart-progress-bar-segment-icon active" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="currentColor"></circle><path d="M7 12L10.5 15.5L17 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> <span class="moonbundle-cart-progress-bar-sold-out-label"> </span></div>`);
  var root_17$1 = /* @__PURE__ */ from_svg(`<svg class="moonbundle-cart-progress-bar-segment-icon active" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="currentColor"></circle><path d="M7 12L10.5 15.5L17 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`);
  var root_20$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-progress-bar-segment-image-wrapper"><svg class="moonbundle-cart-progress-bar-segment-icon inactive gift" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="currentColor"></circle><g transform="translate(12,12) scale(0.65) translate(-12,-12)" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2"></path><path d="M12 8l0 13"></path><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5"></path></g></svg> <span class="moonbundle-cart-progress-bar-sold-out-label"> </span></div>`);
  var root_21$1 = /* @__PURE__ */ from_svg(`<svg class="moonbundle-cart-progress-bar-segment-icon inactive gift" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="currentColor"></circle><g transform="translate(12,12) scale(0.65) translate(-12,-12)" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2"></path><path d="M12 8l0 13"></path><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5"></path></g></svg>`);
  var root_22$1 = /* @__PURE__ */ from_svg(`<svg class="moonbundle-cart-progress-bar-segment-icon inactive" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="currentColor"></circle><path d="M8 8L16 16M16 8L8 16" stroke="white" stroke-width="2" stroke-linecap="round"></path></svg>`);
  var root_23$1 = /* @__PURE__ */ from_html(`<span> </span>`);
  var root_25$2 = /* @__PURE__ */ from_html(`<span class="moonbundle-cart-progress-bar-segment-text-below-subtitle"> </span>`);
  var root_24 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-progress-bar-segment-text-below"><span class="moonbundle-cart-progress-bar-segment-text-below-title"> </span> <!></div>`);
  var root$c = /* @__PURE__ */ from_html(`<div><div><div class="moonbundle-cart-progress-bar-segment-title"><!> <!></div></div> <!></div>`);
  function ProgressSegment($$anchor, $$props) {
    push($$props, true);
    let isSegmentActive = prop($$props, "isSegmentActive", 3, false), segmentTitleProcessed = prop($$props, "segmentTitleProcessed", 3, ""), segmentSubtitleProcessed = prop($$props, "segmentSubtitleProcessed", 3, ""), isIconsActive = prop($$props, "isIconsActive", 3, false), productImageSrc = prop($$props, "productImageSrc", 3, ""), soldOutLabelText = prop($$props, "soldOutLabelText", 3, "SOLD OUT"), showSoldOutBadge = prop($$props, "showSoldOutBadge", 3, false);
    const iconsSvg = {
      cart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>',
      check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M7 12L10.5 15.5L17 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>',
      crossCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M8 8L16 16M16 8L8 16" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>',
      shipping: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"/><path d="M3 9l4 0"/></svg>',
      giftCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="currentColor"/><g transform="translate(12,12) scale(0.65) translate(-12,-12)" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2"/><path d="M12 8l0 13"/><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5"/></g></svg>',
      clock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12l-2 3" /><path d="M12 7v5" /></svg>',
      cross: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>',
      flame: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235" /></svg>',
      giftCard: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -8"/><path d="M7 16l3 -3l3 3"/><path d="M8 13c-.789 0 -2 -.672 -2 -1.5s.711 -1.5 1.5 -1.5c1.128 -.02 2.077 1.17 2.5 3c.423 -1.83 1.372 -3.02 2.5 -3c.789 0 1.5 .672 1.5 1.5s-1.211 1.5 -2 1.5h-4"/></svg>',
      gift: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2" /><path d="M12 8l0 13" /><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" /></svg>',
      handHeart: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M230.33,141.06a24.34,24.34,0,0,0-18.61-4.77C230.5,117.33,240,98.48,240,80c0-26.47-21.29-48-47.46-48A47.58,47.58,0,0,0,156,48.75,47.58,47.58,0,0,0,119.46,32C93.29,32,72,53.53,72,80c0,11,3.24,21.69,10.06,33a31.87,31.87,0,0,0-14.75,8.4L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM119.46,48A31.15,31.15,0,0,1,148.6,67a8,8,0,0,0,14.8,0,31.15,31.15,0,0,1,29.14-19C209.59,48,224,62.65,224,80c0,19.51-15.79,41.58-45.66,63.9l-11.09,2.55A28,28,0,0,0,140,112H100.68C92.05,100.36,88,90.12,88,80,88,62.65,102.41,48,119.46,48ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9Z"></path></svg>',
      heart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>',
      plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>',
      ring: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /><path d="M21 6.727a11.05 11.05 0 0 0 -2.794 -3.727" /><path d="M3 6.727a11.05 11.05 0 0 1 2.792 -3.727" /></svg>',
      sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 7a9.3 9.3 0 0 0 1.516 -.546c.911 -.438 1.494 -1.015 1.937 -1.932c.207 -.428 .382 -.928 .547 -1.522c.165 .595 .34 1.095 .547 1.521c.443 .918 1.026 1.495 1.937 1.933c.426 .205 .925 .38 1.516 .546a9.3 9.3 0 0 0 -1.516 .547c-.911 .438 -1.494 1.015 -1.937 1.932a9 9 0 0 0 -.547 1.521c-.165 -.594 -.34 -1.095 -.547 -1.521c-.443 -.918 -1.026 -1.494 -1.937 -1.932a9 9 0 0 0 -1.516 -.547" /><path d="M3 14a21 21 0 0 0 1.652 -.532c2.542 -.953 3.853 -2.238 4.816 -4.806a20 20 0 0 0 .532 -1.662a20 20 0 0 0 .532 1.662c.963 2.567 2.275 3.853 4.816 4.806q .75 .28 1.652 .532a21 21 0 0 0 -1.652 .532c-2.542 .953 -3.854 2.238 -4.816 4.806a20 20 0 0 0 -.532 1.662a20 20 0 0 0 -.532 -1.662c-.963 -2.568 -2.275 -3.853 -4.816 -4.806a21 21 0 0 0 -1.652 -.532" /></svg>',
      star: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" /></svg>',
      tag: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3" /></svg>',
      thumb: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" /></svg>',
      thunder: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z"></path></svg>'
    };
    const showIconResolved = /* @__PURE__ */ user_derived(() => isSegmentActive() ? !!$$props.segment.showIconValidated : !!$$props.segment.showIconUnvalidated);
    const iconKeyResolved = /* @__PURE__ */ user_derived(() => isSegmentActive() ? $$props.segment.segmentIconKeyValidated : $$props.segment.segmentIconKeyUnvalidated);
    const showCustomImageResolved = /* @__PURE__ */ user_derived(() => isSegmentActive() ? !!$$props.segment.showCustomImageValidated : !!$$props.segment.showCustomImageUnvalidated);
    const customImageUrlResolved = /* @__PURE__ */ user_derived(() => isSegmentActive() ? $$props.segment.customImageUrlValidated : $$props.segment.customImageUrlUnvalidated);
    const showProductImageResolved = /* @__PURE__ */ user_derived(() => isSegmentActive() ? !!$$props.segment.showProductImageValidated : !!$$props.segment.showProductImageUnvalidated);
    const showCustomImage = /* @__PURE__ */ user_derived(() => !get(showIconResolved) && get(showCustomImageResolved) && !!get(customImageUrlResolved));
    const showProductImage = /* @__PURE__ */ user_derived(() => !get(showIconResolved) && !get(showCustomImage) && get(showProductImageResolved) && $$props.segment.type === "product-discount" && !!productImageSrc());
    const isImageLoading = /* @__PURE__ */ user_derived(() => !get(showIconResolved) && !get(showCustomImage) && get(showProductImageResolved) && $$props.segment.type === "product-discount" && !productImageSrc());
    const showSegmentIcon = /* @__PURE__ */ user_derived(() => get(showIconResolved) && !!get(iconKeyResolved) && !!iconsSvg[get(iconKeyResolved)]);
    var div = root$c();
    let classes;
    var div_1 = child(div);
    let classes_1;
    var div_2 = child(div_1);
    var node = child(div_2);
    {
      var consequent_12 = ($$anchor2) => {
        var fragment = comment();
        var node_1 = first_child(fragment);
        {
          var consequent_1 = ($$anchor3) => {
            var div_3 = root_2$7();
            var img = child(div_3);
            let classes_2;
            var node_2 = sibling(img, 2);
            {
              var consequent = ($$anchor4) => {
                var span = root_3$6();
                var text2 = child(span);
                template_effect(() => set_text(text2, soldOutLabelText()));
                append($$anchor4, span);
              };
              if_block(node_2, ($$render) => {
                if (showSoldOutBadge()) $$render(consequent);
              });
            }
            template_effect(
              ($0) => {
                classes_2 = set_class(img, 1, "moonbundle-cart-progress-bar-segment-icon product-image", null, classes_2, $0);
                set_attribute(img, "src", get(customImageUrlResolved));
                set_attribute(img, "alt", segmentTitleProcessed());
              },
              [() => ({ active: isSegmentActive() })]
            );
            append($$anchor3, div_3);
          };
          var alternate_8 = ($$anchor3) => {
            var fragment_1 = comment();
            var node_3 = first_child(fragment_1);
            {
              var consequent_3 = ($$anchor4) => {
                var div_4 = root_5$4();
                var img_1 = child(div_4);
                let classes_3;
                var node_4 = sibling(img_1, 2);
                {
                  var consequent_2 = ($$anchor5) => {
                    var span_1 = root_6$2();
                    var text_1 = child(span_1);
                    template_effect(() => set_text(text_1, soldOutLabelText()));
                    append($$anchor5, span_1);
                  };
                  if_block(node_4, ($$render) => {
                    if (showSoldOutBadge()) $$render(consequent_2);
                  });
                }
                template_effect(
                  ($0) => {
                    classes_3 = set_class(img_1, 1, "moonbundle-cart-progress-bar-segment-icon product-image", null, classes_3, $0);
                    set_attribute(img_1, "src", productImageSrc());
                    set_attribute(img_1, "alt", segmentTitleProcessed());
                  },
                  [() => ({ active: isSegmentActive() })]
                );
                append($$anchor4, div_4);
              };
              var alternate_7 = ($$anchor4) => {
                var fragment_2 = comment();
                var node_5 = first_child(fragment_2);
                {
                  var consequent_5 = ($$anchor5) => {
                    var div_5 = root_8$2();
                    var node_6 = sibling(child(div_5), 2);
                    {
                      var consequent_4 = ($$anchor6) => {
                        var span_2 = root_9$2();
                        var text_2 = child(span_2);
                        template_effect(() => set_text(text_2, soldOutLabelText()));
                        append($$anchor6, span_2);
                      };
                      if_block(node_6, ($$render) => {
                        if (showSoldOutBadge()) $$render(consequent_4);
                      });
                    }
                    append($$anchor5, div_5);
                  };
                  var alternate_6 = ($$anchor5) => {
                    var fragment_3 = comment();
                    var node_7 = first_child(fragment_3);
                    {
                      var consequent_7 = ($$anchor6) => {
                        var fragment_4 = comment();
                        var node_8 = first_child(fragment_4);
                        {
                          var consequent_6 = ($$anchor7) => {
                            var div_6 = root_12$2();
                            var span_3 = child(div_6);
                            let classes_4;
                            var node_9 = child(span_3);
                            html(node_9, () => iconsSvg[get(iconKeyResolved)]);
                            var span_4 = sibling(span_3, 2);
                            var text_3 = child(span_4);
                            template_effect(
                              ($0) => {
                                classes_4 = set_class(span_3, 1, "moonbundle-cart-progress-bar-segment-icon custom-icon", null, classes_4, $0);
                                set_text(text_3, soldOutLabelText());
                              },
                              [() => ({ validated: isSegmentActive() })]
                            );
                            append($$anchor7, div_6);
                          };
                          var alternate = ($$anchor7) => {
                            var span_5 = root_13$3();
                            let classes_5;
                            var node_10 = child(span_5);
                            html(node_10, () => iconsSvg[get(iconKeyResolved)]);
                            template_effect(($0) => classes_5 = set_class(span_5, 1, "moonbundle-cart-progress-bar-segment-icon custom-icon", null, classes_5, $0), [() => ({ validated: isSegmentActive() })]);
                            append($$anchor7, span_5);
                          };
                          if_block(node_8, ($$render) => {
                            if (showSoldOutBadge()) $$render(consequent_6);
                            else $$render(alternate, false);
                          });
                        }
                        append($$anchor6, fragment_4);
                      };
                      var alternate_5 = ($$anchor6) => {
                        var fragment_5 = comment();
                        var node_11 = first_child(fragment_5);
                        {
                          var consequent_9 = ($$anchor7) => {
                            var fragment_6 = comment();
                            var node_12 = first_child(fragment_6);
                            {
                              var consequent_8 = ($$anchor8) => {
                                var div_7 = root_16$1();
                                var span_6 = sibling(child(div_7), 2);
                                var text_4 = child(span_6);
                                template_effect(() => set_text(text_4, soldOutLabelText()));
                                append($$anchor8, div_7);
                              };
                              var alternate_1 = ($$anchor8) => {
                                var svg = root_17$1();
                                append($$anchor8, svg);
                              };
                              if_block(node_12, ($$render) => {
                                if (showSoldOutBadge()) $$render(consequent_8);
                                else $$render(alternate_1, false);
                              });
                            }
                            append($$anchor7, fragment_6);
                          };
                          var alternate_4 = ($$anchor7) => {
                            var fragment_7 = comment();
                            var node_13 = first_child(fragment_7);
                            {
                              var consequent_11 = ($$anchor8) => {
                                var fragment_8 = comment();
                                var node_14 = first_child(fragment_8);
                                {
                                  var consequent_10 = ($$anchor9) => {
                                    var div_8 = root_20$1();
                                    var span_7 = sibling(child(div_8), 2);
                                    var text_5 = child(span_7);
                                    template_effect(() => set_text(text_5, soldOutLabelText()));
                                    append($$anchor9, div_8);
                                  };
                                  var alternate_2 = ($$anchor9) => {
                                    var svg_1 = root_21$1();
                                    append($$anchor9, svg_1);
                                  };
                                  if_block(node_14, ($$render) => {
                                    if (showSoldOutBadge()) $$render(consequent_10);
                                    else $$render(alternate_2, false);
                                  });
                                }
                                append($$anchor8, fragment_8);
                              };
                              var alternate_3 = ($$anchor8) => {
                                var svg_2 = root_22$1();
                                append($$anchor8, svg_2);
                              };
                              if_block(
                                node_13,
                                ($$render) => {
                                  if ($$props.segment.type === "product-discount") $$render(consequent_11);
                                  else $$render(alternate_3, false);
                                },
                                true
                              );
                            }
                            append($$anchor7, fragment_7);
                          };
                          if_block(
                            node_11,
                            ($$render) => {
                              if (isSegmentActive()) $$render(consequent_9);
                              else $$render(alternate_4, false);
                            },
                            true
                          );
                        }
                        append($$anchor6, fragment_5);
                      };
                      if_block(
                        node_7,
                        ($$render) => {
                          if (get(showSegmentIcon)) $$render(consequent_7);
                          else $$render(alternate_5, false);
                        },
                        true
                      );
                    }
                    append($$anchor5, fragment_3);
                  };
                  if_block(
                    node_5,
                    ($$render) => {
                      if (get(isImageLoading)) $$render(consequent_5);
                      else $$render(alternate_6, false);
                    },
                    true
                  );
                }
                append($$anchor4, fragment_2);
              };
              if_block(
                node_3,
                ($$render) => {
                  if (get(showProductImage)) $$render(consequent_3);
                  else $$render(alternate_7, false);
                },
                true
              );
            }
            append($$anchor3, fragment_1);
          };
          if_block(node_1, ($$render) => {
            if (get(showCustomImage)) $$render(consequent_1);
            else $$render(alternate_8, false);
          });
        }
        append($$anchor2, fragment);
      };
      if_block(node, ($$render) => {
        if (isIconsActive()) $$render(consequent_12);
      });
    }
    var node_15 = sibling(node, 2);
    {
      var consequent_13 = ($$anchor2) => {
        var span_8 = root_23$1();
        var text_6 = child(span_8);
        template_effect(() => set_text(text_6, segmentTitleProcessed()));
        append($$anchor2, span_8);
      };
      if_block(node_15, ($$render) => {
        if (!$$props.segment.textBelow) $$render(consequent_13);
      });
    }
    var node_16 = sibling(div_1, 2);
    {
      var consequent_15 = ($$anchor2) => {
        var div_9 = root_24();
        var span_9 = child(div_9);
        var text_7 = child(span_9);
        var node_17 = sibling(span_9, 2);
        {
          var consequent_14 = ($$anchor3) => {
            var span_10 = root_25$2();
            var text_8 = child(span_10);
            template_effect(() => set_text(text_8, segmentSubtitleProcessed()));
            append($$anchor3, span_10);
          };
          if_block(node_17, ($$render) => {
            if (segmentSubtitleProcessed()) $$render(consequent_14);
          });
        }
        template_effect(() => set_text(text_7, segmentTitleProcessed()));
        append($$anchor2, div_9);
      };
      if_block(node_16, ($$render) => {
        if ($$props.segment.textBelow) $$render(consequent_15);
      });
    }
    template_effect(
      ($0, $1) => {
        classes = set_class(div, 1, "moonbundle-cart-progress-bar-segment-wrapper", null, classes, $0);
        classes_1 = set_class(div_1, 1, "moonbundle-cart-progress-bar-segment", null, classes_1, $1);
        set_attribute(div_1, "data-segment-id", $$props.segment.id);
      },
      [
        () => ({
          "text-below": $$props.segment.textBelow,
          active: isSegmentActive()
        }),
        () => ({ active: isSegmentActive() })
      ]
    );
    append($$anchor, div);
    pop();
  }
  async function handleAddGift(__1, activeGiftSegment, getGiftVariantId, activeGiftSegmentId, isAddingGift, addedGiftSegmentIds) {
    const segment = get(activeGiftSegment);
    const variantId = getGiftVariantId(segment);
    if (!variantId || !segment) {
      set(activeGiftSegmentId, null);
      return;
    }
    const numericId = variantId.split("/").pop();
    const gift = segment.giftProductsProgressBar?.find((p) => p.variantId === variantId);
    const quantity = gift?.quantity || 1;
    set(isAddingGift, true);
    try {
      await fetch("/cart/add.js?moonbundle_cart=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              id: numericId,
              quantity,
              properties: { _moonBundleCart: segment.id }
            }
          ]
        })
      });
      set(addedGiftSegmentIds, /* @__PURE__ */ new Set([...get(addedGiftSegmentIds), segment.id]), true);
    } catch (_) {
    }
    set(isAddingGift, false);
    set(activeGiftSegmentId, null);
  }
  var root_2$6 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-progress-bar-header"><!></div>`);
  var root_4$2 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-progress-bar-initial-text"><!></div>`);
  var root_5$3 = /* @__PURE__ */ from_html(`<!> <div><!></div> <!>`, 1);
  var on_click$2 = (
    // Scroll vers le dernier segment actif ou le prochain à débloquer
    // Déclencheur: currentValue change
    (__2, activeGiftSegmentId, segment) => set(activeGiftSegmentId, get(segment).id, true)
  );
  var root_10 = /* @__PURE__ */ from_html(`<button class="moonbundle-gift-add-btn" type="button"> </button>`);
  var root_8$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-gift-buttons-wrapper"></div>`);
  var on_click_1$1 = (e, activeGiftSegmentId) => {
    if (e.target === e.currentTarget) set(activeGiftSegmentId, null);
  };
  var on_keydown = (e, activeGiftSegmentId) => {
    if (e.key === "Escape") set(activeGiftSegmentId, null);
  };
  var on_click_2$1 = (__3, activeGiftSegmentId) => set(activeGiftSegmentId, null);
  var root_12$1 = /* @__PURE__ */ from_html(`<img class="moonbundle-gift-popup-image"/>`);
  var root_13$2 = /* @__PURE__ */ from_html(`<p class="moonbundle-gift-popup-title"> </p>`);
  var root_14$1 = /* @__PURE__ */ from_html(`<span class="moonbundle-gift-popup-add-spinner"></span>`);
  var root_11$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-gift-popup-overlay" role="dialog" aria-modal="true" tabindex="-1"><div class="moonbundle-gift-popup"><button class="moonbundle-gift-popup-close" type="button" aria-label="Close">✕</button> <!> <!> <button class="moonbundle-gift-popup-add-btn" type="button"><!></button></div></div>`);
  var root$b = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-progress-bar-container"><div class="moonbundle-cart-progress-bar-inner"><!> <!> <div class="moonbundle-cart-progress-bar"><div></div></div></div> <!></div> <!>`, 1);
  function CartProgressBar($$anchor, $$props) {
    push($$props, true);
    let currencyRate = prop($$props, "currencyRate", 3, 1), storefrontToken = prop($$props, "storefrontToken", 3, ""), shop = prop($$props, "shop", 3, null), preloadedGiftImages = prop($$props, "preloadedGiftImages", 19, () => ({})), country = prop($$props, "country", 3, null), locale = prop($$props, "locale", 3, null), variantAvailability = prop($$props, "variantAvailability", 31, () => proxy({})), cart = prop($$props, "cart", 3, null);
    const progressBarSegments = /* @__PURE__ */ user_derived(() => $$props.progressBar.segmentsProgressBar || []);
    const soldOutLabelText = /* @__PURE__ */ user_derived(() => getTranslated("progressBar.soldOutLabel") || $$props.progressBar.soldOutLabel || "SOLD OUT");
    const hasTextBelow = /* @__PURE__ */ user_derived(() => get(progressBarSegments).some((s) => s.textBelow));
    const hasSubtitle = /* @__PURE__ */ user_derived(() => get(progressBarSegments).some((s) => s.textBelow && s.subtitle));
    const unlockedType = /* @__PURE__ */ user_derived(() => $$props.progressBar.unlockedType);
    const currentValue = /* @__PURE__ */ user_derived(() => get(unlockedType) === "item count" ? $$props.itemCountWithoutGifts : $$props.roundToTwoDecimals($$props.totalForProgressBar / 100));
    const toDisplayCurrency = (treshold) => $$props.roundToTwoDecimals(treshold * currencyRate());
    const activeSegments = /* @__PURE__ */ user_derived(() => get(progressBarSegments).filter((segment) => get(currentValue) >= toDisplayCurrency(segment.treshold)));
    const lastActiveSegment = /* @__PURE__ */ user_derived(() => get(activeSegments).length > 0 ? get(activeSegments)[get(activeSegments).length - 1] : null);
    let giftProductImages = /* @__PURE__ */ state(proxy({ ...preloadedGiftImages() }));
    let giftProductTitles = /* @__PURE__ */ state(proxy({}));
    user_effect(() => {
      if (!preloadedGiftImages() || Object.keys(preloadedGiftImages()).length === 0) return;
      const current = untrack(() => get(giftProductImages));
      const hasNew = Object.entries(preloadedGiftImages()).some(([id, url]) => current[id] !== url);
      if (hasNew) set(giftProductImages, { ...current, ...preloadedGiftImages() }, true);
    });
    user_effect(() => {
      const giftProductIds = [];
      const giftVariantIds = [];
      for (const segment of get(progressBarSegments)) {
        if (segment.type === "product-discount") {
          for (const gift of segment.giftProductsProgressBar ?? []) {
            if (gift.productId && !giftProductIds.includes(gift.productId)) {
              giftProductIds.push(gift.productId);
            }
            if (gift.variantId && !giftVariantIds.includes(gift.variantId)) {
              giftVariantIds.push(gift.variantId);
            }
          }
        }
      }
      const currentImages = untrack(() => get(giftProductImages));
      const currentAvail = untrack(() => variantAvailability());
      const missingProductIds = giftProductIds.filter((id) => !(id in currentImages));
      const missingVariantIds = giftVariantIds.filter((id) => variantAvailabilityLookup(currentAvail, id) === void 0);
      if (missingProductIds.length === 0 && missingVariantIds.length === 0 || !storefrontToken()) {
        return;
      }
      fetchProgressBarGiftImages(missingProductIds, missingVariantIds, storefrontToken(), shop(), country(), locale()).then(({ images, titles, variantAvailableForSale }) => {
        set(giftProductImages, { ...untrack(() => get(giftProductImages)), ...images }, true);
        set(giftProductTitles, { ...untrack(() => get(giftProductTitles)), ...titles }, true);
        variantAvailability({
          ...untrack(() => variantAvailability()),
          ...variantAvailableForSale
        });
      });
    });
    let activeGiftSegmentId = /* @__PURE__ */ state(null);
    let addedGiftSegmentIds = /* @__PURE__ */ state(proxy(/* @__PURE__ */ new Set()));
    let isAddingGift = /* @__PURE__ */ state(false);
    user_effect(() => {
      const cv = get(currentValue);
      const segments = get(progressBarSegments);
      const current = untrack(() => get(addedGiftSegmentIds));
      if (current.size === 0) return;
      const toRemove = [...current].filter((id) => {
        const seg = segments.find((s) => s.id === id);
        return !seg || cv < toDisplayCurrency(seg.treshold);
      });
      if (toRemove.length > 0) {
        const next = new Set(current);
        toRemove.forEach((id) => next.delete(id));
        set(addedGiftSegmentIds, next, true);
      }
    });
    const giftSegments = /* @__PURE__ */ user_derived(() => get(progressBarSegments).filter((s) => s.type === "product-discount"));
    const giftSegmentIdsInCart = /* @__PURE__ */ user_derived(() => {
      const ids = /* @__PURE__ */ new Set();
      const validIds = new Set(get(giftSegments).map((s) => s.id));
      for (const item of cart()?.items ?? []) {
        const prop2 = item.properties?._moonBundleCart;
        if (prop2 && validIds.has(prop2)) {
          ids.add(prop2);
        }
      }
      return ids;
    });
    function getDisplayGift(segment) {
      return segment?.giftProductsProgressBar?.find((p) => !preloadedGiftImages()[p.productId]) ?? segment?.giftProductsProgressBar?.[0];
    }
    function getGiftProductId(segment) {
      return getDisplayGift(segment)?.productId;
    }
    function getGiftVariantId(segment) {
      return getDisplayGift(segment)?.variantId;
    }
    function replaceTierTextPlaceholders(raw, formattedDiscount, productTitle) {
      return replaceDynamicVariables(raw, {
        discount_amount: formattedDiscount,
        product_title: productTitle
      });
    }
    function buildButtonLabel(segment) {
      const raw = $$props.progressBar.giftButtonText || `🎁 CLICK TO ADD : {{titleTiers}} (FREE)`;
      const pid = getGiftProductId(segment);
      const ptitle = pid && get(giftProductTitles)[pid] || "";
      return replaceDynamicVariables(raw, { titleTiers: segment?.title ?? "", product_title: ptitle });
    }
    const activeGiftSegment = /* @__PURE__ */ user_derived(() => get(progressBarSegments).find((s) => s.id === get(activeGiftSegmentId)));
    let segmentsContainerRef = /* @__PURE__ */ state(null);
    let segmentRefs = proxy([]);
    user_effect(() => {
      if (!get(segmentsContainerRef) || get(progressBarSegments).length === 0) return;
      get(currentValue);
      const targetIndex = get(activeSegments).length > 0 ? get(progressBarSegments).indexOf(get(lastActiveSegment)) : 0;
      const targetSegment = segmentRefs[targetIndex];
      if (targetSegment) {
        targetSegment.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    });
    var fragment = root$b();
    var div = first_child(fragment);
    var div_1 = child(div);
    var node = child(div_1);
    {
      var consequent_1 = ($$anchor2) => {
        var fragment_1 = comment();
        const isLastSegmentOfBar = /* @__PURE__ */ user_derived(() => get(lastActiveSegment) === get(progressBarSegments)[get(progressBarSegments).length - 1]);
        var node_1 = first_child(fragment_1);
        {
          var consequent = ($$anchor3) => {
            var div_2 = root_2$6();
            const formattedDiscountUnlocked = /* @__PURE__ */ user_derived(() => get(lastActiveSegment).discountType === "percentage" ? `${get(lastActiveSegment).discountAmount}%` : get(lastActiveSegment).discountType === "fixed_amount" ? $$props.shopifyFormatCurrency(get(lastActiveSegment).discountAmount * currencyRate() * 100) : "");
            const lastActivePid = /* @__PURE__ */ user_derived(() => getGiftProductId(get(lastActiveSegment)));
            const lastActiveProductTitle = /* @__PURE__ */ user_derived(() => get(lastActivePid) && get(giftProductTitles)[get(lastActivePid)] || "");
            const lastActiveSegmentTitleRaw = /* @__PURE__ */ user_derived(() => getTranslated("progressBar.segments." + get(lastActiveSegment).id + ".title") || get(lastActiveSegment).title);
            const lastActiveSegmentTitleProcessed = /* @__PURE__ */ user_derived(() => replaceTierTextPlaceholders(get(lastActiveSegmentTitleRaw), get(formattedDiscountUnlocked), get(lastActiveProductTitle)));
            const unlockedTextRaw = /* @__PURE__ */ user_derived(() => getTranslated("progressBar.unlockedText") || $$props.progressBar.unlockedText);
            const unlockedTextProcessed = /* @__PURE__ */ user_derived(() => replaceDynamicVariables(get(unlockedTextRaw), {
              name_promo: `<strong>${get(lastActiveSegmentTitleProcessed)}</strong>`,
              discount_amount: `<strong>${get(formattedDiscountUnlocked)}</strong>`
            }));
            var node_2 = child(div_2);
            html(node_2, () => get(unlockedTextProcessed));
            append($$anchor3, div_2);
          };
          if_block(node_1, ($$render) => {
            if ($$props.progressBar.isShowCongratsEverywhere || get(isLastSegmentOfBar)) $$render(consequent);
          });
        }
        append($$anchor2, fragment_1);
      };
      if_block(node, ($$render) => {
        if ($$props.progressBar.unlockedText && get(lastActiveSegment)) $$render(consequent_1);
      });
    }
    var node_3 = sibling(node, 2);
    {
      var consequent_3 = ($$anchor2) => {
        var fragment_2 = comment();
        const nextSegment = /* @__PURE__ */ user_derived(() => get(progressBarSegments).find((segment) => get(currentValue) < toDisplayCurrency(segment.treshold)));
        var node_4 = first_child(fragment_2);
        {
          var consequent_2 = ($$anchor3) => {
            var div_3 = root_4$2();
            const quantityToUnlock = /* @__PURE__ */ user_derived(() => get(unlockedType) === "item count" ? Math.ceil(get(nextSegment).treshold - get(currentValue)) : Math.ceil((toDisplayCurrency(get(nextSegment).treshold) - get(currentValue)) * 100) / 100);
            const formattedQuantity = /* @__PURE__ */ user_derived(() => get(unlockedType) === "item count" ? get(quantityToUnlock).toString() : $$props.shopifyFormatCurrency(get(quantityToUnlock) * 100));
            const formattedDiscount = /* @__PURE__ */ user_derived(() => get(nextSegment).discountType === "percentage" ? `${get(nextSegment).discountAmount}%` : get(nextSegment).discountType === "fixed_amount" ? $$props.shopifyFormatCurrency(get(nextSegment).discountAmount * currencyRate() * 100) : "");
            const nextPid = /* @__PURE__ */ user_derived(() => getGiftProductId(get(nextSegment)));
            const nextProductTitle = /* @__PURE__ */ user_derived(() => get(nextPid) && get(giftProductTitles)[get(nextPid)] || "");
            const nextSegmentTitleRaw = /* @__PURE__ */ user_derived(() => getTranslated("progressBar.segments." + get(nextSegment).id + ".title") || get(nextSegment).title);
            const nextSegmentTitleProcessed = /* @__PURE__ */ user_derived(() => replaceTierTextPlaceholders(get(nextSegmentTitleRaw), get(formattedDiscount), get(nextProductTitle)));
            const initialTextRaw = /* @__PURE__ */ user_derived(() => getTranslated("progressBar.initialText") || $$props.progressBar.initialText);
            const initialTextProcessed = /* @__PURE__ */ user_derived(() => replaceDynamicVariables(get(initialTextRaw), {
              quantity_to_unlock: `<strong>${get(formattedQuantity)}</strong>`,
              next_name_promo: `<strong>${get(nextSegmentTitleProcessed)}</strong>`,
              discount_amount: `<strong>${get(formattedDiscount)}</strong>`
            }));
            var node_5 = child(div_3);
            html(node_5, () => get(initialTextProcessed));
            append($$anchor3, div_3);
          };
          if_block(node_4, ($$render) => {
            if (get(nextSegment)) $$render(consequent_2);
          });
        }
        append($$anchor2, fragment_2);
      };
      if_block(node_3, ($$render) => {
        if ($$props.progressBar.initialText) $$render(consequent_3);
      });
    }
    var div_4 = sibling(node_3, 2);
    var div_5 = child(div_4);
    let classes;
    each(div_5, 21, () => get(progressBarSegments), index, ($$anchor2, segment, index2) => {
      var fragment_3 = root_5$3();
      const isSegmentActive = /* @__PURE__ */ user_derived(() => get(currentValue) >= toDisplayCurrency(get(segment).treshold));
      const isNextSegmentActive = /* @__PURE__ */ user_derived(() => index2 < get(progressBarSegments).length - 1 && get(currentValue) >= toDisplayCurrency(get(progressBarSegments)[index2 + 1].treshold));
      const formattedDiscountSegment = /* @__PURE__ */ user_derived(() => get(segment).discountType === "percentage" ? `${get(segment).discountAmount}%` : get(segment).discountType === "fixed_amount" ? $$props.shopifyFormatCurrency(get(segment).discountAmount * currencyRate() * 100) : "");
      const displayGift = /* @__PURE__ */ user_derived(() => get(segment).giftProductsProgressBar?.find((p) => !preloadedGiftImages()[p.productId]) ?? get(segment).giftProductsProgressBar?.[0]);
      const displayProductId = /* @__PURE__ */ user_derived(() => get(displayGift)?.productId);
      const giftsForOos = /* @__PURE__ */ user_derived(() => get(segment).giftProductsProgressBar ?? []);
      const anyGiftVariantOos = /* @__PURE__ */ user_derived(() => get(giftsForOos).some((g) => variantAvailabilityLookup(variantAvailability(), g.variantId) === false));
      const showSoldOutBadge = /* @__PURE__ */ user_derived(() => !!get(segment).showSoldOutLabel && get(anyGiftVariantOos));
      const tierProductTitle = /* @__PURE__ */ user_derived(() => get(displayProductId) && get(giftProductTitles)[get(displayProductId)] || "");
      const segmentTitleRaw = /* @__PURE__ */ user_derived(() => getTranslated("progressBar.segments." + get(segment).id + ".title") || get(segment).title);
      const segmentTitleProcessed = /* @__PURE__ */ user_derived(() => replaceTierTextPlaceholders(get(segmentTitleRaw), get(formattedDiscountSegment), get(tierProductTitle)));
      const segmentSubtitleRaw = /* @__PURE__ */ user_derived(() => getTranslated("progressBar.segments." + get(segment).id + ".subtitle") || get(segment).subtitle || "");
      const segmentSubtitleProcessed = /* @__PURE__ */ user_derived(() => replaceTierTextPlaceholders(get(segmentSubtitleRaw), get(formattedDiscountSegment), get(tierProductTitle)));
      var node_6 = first_child(fragment_3);
      {
        var consequent_4 = ($$anchor3) => {
          const tresholdInDisplay = /* @__PURE__ */ user_derived(() => toDisplayCurrency(get(segment).treshold));
          const progressPercentage = /* @__PURE__ */ user_derived(() => get(currentValue) >= get(tresholdInDisplay) ? 100 : Math.min(100, Math.max(0, $$props.roundToTwoDecimals(get(currentValue) / get(tresholdInDisplay) * 100))));
          ProgressConnector($$anchor3, {
            get active() {
              return get(isSegmentActive);
            },
            get progressPercentage() {
              return get(progressPercentage);
            },
            isFirst: true
          });
        };
        if_block(node_6, ($$render) => {
          if (index2 === 0) $$render(consequent_4);
        });
      }
      var div_6 = sibling(node_6, 2);
      var node_7 = child(div_6);
      {
        let $0 = /* @__PURE__ */ user_derived(() => $$props.progressBar?.isIconsActive);
        let $1 = /* @__PURE__ */ user_derived(() => get(giftProductImages)[get(displayProductId)] ?? "");
        ProgressSegment(node_7, {
          get segment() {
            return get(segment);
          },
          get isSegmentActive() {
            return get(isSegmentActive);
          },
          get segmentTitleProcessed() {
            return get(segmentTitleProcessed);
          },
          get segmentSubtitleProcessed() {
            return get(segmentSubtitleProcessed);
          },
          get isIconsActive() {
            return get($0);
          },
          get productImageSrc() {
            return get($1);
          },
          get soldOutLabelText() {
            return get(soldOutLabelText);
          },
          get showSoldOutBadge() {
            return get(showSoldOutBadge);
          }
        });
      }
      bind_this(div_6, ($$value, index3) => segmentRefs[index3] = $$value, (index3) => segmentRefs?.[index3], () => [index2]);
      var node_8 = sibling(div_6, 2);
      {
        var consequent_5 = ($$anchor3) => {
          const nextSegment = /* @__PURE__ */ user_derived(() => get(progressBarSegments)[index2 + 1]);
          const segmentRange = /* @__PURE__ */ user_derived(() => $$props.roundToTwoDecimals((get(nextSegment).treshold - get(segment).treshold) * currencyRate()));
          const progressInSegment = /* @__PURE__ */ user_derived(() => Math.max(0, $$props.roundToTwoDecimals(get(currentValue) - toDisplayCurrency(get(segment).treshold))));
          const connectorProgressPercentage = /* @__PURE__ */ user_derived(() => get(currentValue) >= toDisplayCurrency(get(nextSegment).treshold) ? 100 : get(currentValue) < toDisplayCurrency(get(segment).treshold) ? 0 : Math.min(100, $$props.roundToTwoDecimals(get(progressInSegment) / get(segmentRange) * 100)));
          ProgressConnector($$anchor3, {
            get active() {
              return get(isNextSegmentActive);
            },
            get progressPercentage() {
              return get(connectorProgressPercentage);
            }
          });
        };
        if_block(node_8, ($$render) => {
          if (index2 < get(progressBarSegments).length - 1) $$render(consequent_5);
        });
      }
      append($$anchor2, fragment_3);
    });
    bind_this(div_5, ($$value) => set(segmentsContainerRef, $$value), () => get(segmentsContainerRef));
    var node_9 = sibling(div_1, 2);
    {
      var consequent_7 = ($$anchor2) => {
        var div_7 = root_8$1();
        each(div_7, 21, () => get(giftSegments), (segment) => segment.id, ($$anchor3, segment) => {
          var fragment_6 = comment();
          const giftVariantGid = /* @__PURE__ */ user_derived(() => getGiftVariantId(get(segment)));
          const giftKnownOos = /* @__PURE__ */ user_derived(() => variantAvailabilityLookup(variantAvailability(), get(giftVariantGid)) === false);
          var node_10 = first_child(fragment_6);
          {
            var consequent_6 = ($$anchor4) => {
              var button = root_10();
              button.__click = [on_click$2, activeGiftSegmentId, segment];
              var text2 = child(button);
              template_effect(($0) => set_text(text2, $0), [() => buildButtonLabel(get(segment))]);
              append($$anchor4, button);
            };
            if_block(node_10, ($$render) => {
              if (get(currentValue) >= toDisplayCurrency(get(segment).treshold) && !get(addedGiftSegmentIds).has(get(segment).id) && !get(giftSegmentIdsInCart).has(get(segment).id) && !get(giftKnownOos)) $$render(consequent_6);
            });
          }
          append($$anchor3, fragment_6);
        });
        append($$anchor2, div_7);
      };
      if_block(node_9, ($$render) => {
        if ($$props.progressBar.isGiftButtonActive && get(giftSegments).length > 0) $$render(consequent_7);
      });
    }
    var node_11 = sibling(div, 2);
    {
      var consequent_11 = ($$anchor2) => {
        var div_8 = root_11$1();
        const popupProductId = /* @__PURE__ */ user_derived(() => getGiftProductId(get(activeGiftSegment)));
        const popupVariantGid = /* @__PURE__ */ user_derived(() => getGiftVariantId(get(activeGiftSegment)));
        const popupVariantOos = /* @__PURE__ */ user_derived(() => variantAvailabilityLookup(variantAvailability(), get(popupVariantGid)) === false);
        const popupTitle = /* @__PURE__ */ user_derived(() => get(popupProductId) && get(giftProductTitles)[get(popupProductId)] || get(activeGiftSegment).title);
        div_8.__click = [on_click_1$1, activeGiftSegmentId];
        div_8.__keydown = [on_keydown, activeGiftSegmentId];
        var div_9 = child(div_8);
        var button_1 = child(div_9);
        button_1.__click = [on_click_2$1, activeGiftSegmentId];
        var node_12 = sibling(button_1, 2);
        {
          var consequent_8 = ($$anchor3) => {
            var img = root_12$1();
            template_effect(() => {
              set_attribute(img, "src", get(giftProductImages)[get(popupProductId)]);
              set_attribute(img, "alt", get(activeGiftSegment).title ?? "Gift");
            });
            append($$anchor3, img);
          };
          if_block(node_12, ($$render) => {
            if (get(popupProductId) && get(giftProductImages)[get(popupProductId)]) $$render(consequent_8);
          });
        }
        var node_13 = sibling(node_12, 2);
        {
          var consequent_9 = ($$anchor3) => {
            var p_1 = root_13$2();
            var text_1 = child(p_1);
            template_effect(() => set_text(text_1, get(popupTitle)));
            append($$anchor3, p_1);
          };
          if_block(node_13, ($$render) => {
            if (get(popupTitle)) $$render(consequent_9);
          });
        }
        var button_2 = sibling(node_13, 2);
        button_2.__click = [
          handleAddGift,
          activeGiftSegment,
          getGiftVariantId,
          activeGiftSegmentId,
          isAddingGift,
          addedGiftSegmentIds
        ];
        var node_14 = child(button_2);
        {
          var consequent_10 = ($$anchor3) => {
            var span = root_14$1();
            append($$anchor3, span);
          };
          var alternate = ($$anchor3) => {
            var text_2 = text();
            template_effect(() => set_text(text_2, $$props.progressBar.giftPopupAddText || "ADD"));
            append($$anchor3, text_2);
          };
          if_block(node_14, ($$render) => {
            if (get(isAddingGift)) $$render(consequent_10);
            else $$render(alternate, false);
          });
        }
        template_effect(() => button_2.disabled = get(isAddingGift) || get(popupVariantOos));
        append($$anchor2, div_8);
      };
      if_block(node_11, ($$render) => {
        if (get(activeGiftSegmentId) && get(activeGiftSegment)) $$render(consequent_11);
      });
    }
    template_effect(($0) => classes = set_class(div_5, 1, "moonbundle-cart-progress-bar-segments", null, classes, $0), [
      () => ({
        "has-text-below": get(hasTextBelow),
        "has-subtitle": get(hasSubtitle)
      })
    ]);
    append($$anchor, fragment);
    pop();
  }
  delegate(["click", "keydown"]);
  var root_1$8 = /* @__PURE__ */ from_html(`<span class="moonbundle-cart-upsell-counter"> </span>`);
  var root$a = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-navigation"><button class="moonbundle-cart-upsell-nav-btn moonbundle-cart-upsell-nav-prev" aria-label="Previous upsell"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2L6 8l4 6"></path></svg></button> <!> <button class="moonbundle-cart-upsell-nav-btn moonbundle-cart-upsell-nav-next" aria-label="Next upsell"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2l4 6-4 6"></path></svg></button></div>`);
  function UpsellNavigation($$anchor, $$props) {
    var div = root$a();
    var button = child(div);
    button.__click = function(...$$args) {
      $$props.previousUpsell?.apply(this, $$args);
    };
    var node = sibling(button, 2);
    {
      var consequent = ($$anchor2) => {
        var span = root_1$8();
        var text2 = child(span);
        template_effect(() => {
          set_style(span, `color: ${($$props.textColor || "currentColor") ?? ""}`);
          set_text(text2, `${$$props.currentIndex + 1}/${$$props.totalProducts ?? ""}`);
        });
        append($$anchor2, span);
      };
      if_block(node, ($$render) => {
        if ($$props.showCounter && $$props.totalProducts > 1) $$render(consequent);
      });
    }
    var button_1 = sibling(node, 2);
    button_1.__click = function(...$$args) {
      $$props.nextUpsell?.apply(this, $$args);
    };
    append($$anchor, div);
  }
  delegate(["click"]);
  function onUpsellLinkClick(e, upsellLink) {
    if (!get(upsellLink).navigable) e.preventDefault();
  }
  async function handleToggleChange(_, isDisabled, isLeaving, $$props) {
    if (get(isDisabled) || get(isLeaving)) return;
    await new Promise((resolve) => setTimeout(resolve, 600));
    set(isLeaving, true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    $$props.handleUpsellAddToCart($$props.upsellProduct);
  }
  var root_3$5 = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-upsell-product-subtitle"><!></p>`);
  var root_5$2 = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-upsell-product-original-price"><!></p>`);
  var on_change$1 = (e, $$props) => $$props.handleUpsellVariantChange(e, $$props.upsellProduct);
  var root_8 = /* @__PURE__ */ from_html(`<option> </option>`);
  var root_7$2 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-container-alloptions"><div class="moonbundle-cart-upsell-product-form__input"><div class="moonbundle-cart-upsell-select"><select class="moonbundle-cart-upsell-select__select" name="options"></select></div> <div class="moonbundle-product-form__error-message"></div></div></div>`);
  var root_9$1 = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-upsell-product-discount"> </p>`);
  var on_click$1 = (__1, $$props) => $$props.handleUpsellAddToCart($$props.upsellProduct);
  var root_11 = /* @__PURE__ */ from_html(`<div class="moonbundle-loading-overlay__spinner"><svg aria-hidden="true" focusable="false" class="moonbundle-spinner-rotator" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="moonbundle-circle-loader" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle></svg></div>`);
  var root_2$5 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-product-details"><h4 class="moonbundle-cart-upsell-product-title"><a> </a></h4> <!> <!> <div class="moonbundle-cart-upsell-product-price-container"><!> <p class="moonbundle-cart-upsell-product-price"><!></p></div> <!></div> <div><!> <button class="moonbundle-cart-upsell-add-to-cart-btn" data-action="add-upsell"><!></button></div>`, 1);
  var root_1$7 = /* @__PURE__ */ from_html(`<div><div class="moonbundle-cart-upsell-product-container"><div class="moonbundle-cart-upsell-product-image-container"><a><img class="moonbundle-cart-upsell-product-image"/></a></div> <!></div></div>`);
  var on_click_1 = (__2, $$props) => $$props.handleUpsellAddToCart($$props.upsellProduct);
  var root_15$2 = /* @__PURE__ */ from_html(`<div class="moonbundle-loading-overlay__spinner"><svg aria-hidden="true" focusable="false" class="moonbundle-spinner-rotator" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="moonbundle-circle-loader" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle></svg></div>`);
  var root_16 = /* @__PURE__ */ from_svg(`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="1" x2="7" y2="13"></line><line x1="1" y1="7" x2="13" y2="7"></line></svg>`);
  var root_14 = /* @__PURE__ */ from_html(`<button class="moonbundle-cart-upsell-plus-btn" data-action="add-upsell"><!></button>`);
  var root_18 = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-upsell-product-subtitle"> </p>`);
  var root_20 = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-upsell-product-original-price"><!></p>`);
  var on_change_1 = (e, $$props) => $$props.handleUpsellVariantChange(e, $$props.upsellProduct);
  var root_23 = /* @__PURE__ */ from_html(`<option> </option>`);
  var root_22 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-select"><select class="moonbundle-cart-upsell-select__select" name="options"></select></div>`);
  var root_17 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-product-details"><h4 class="moonbundle-cart-upsell-product-title"><a> </a></h4> <!> <!> <div class="moonbundle-cart-upsell-product-price-container"><!> <p class="moonbundle-cart-upsell-product-price"><!></p></div> <!></div>`);
  var root_13$1 = /* @__PURE__ */ from_html(`<div><div class="moonbundle-cart-upsell-product-image-container"><a><img class="moonbundle-cart-upsell-product-image"/></a> <!></div> <!></div>`);
  var root_26 = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-upsell-product-subtitle"> </p>`);
  var root_28 = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-upsell-product-original-price"><!></p>`);
  var on_change_2 = (e, $$props) => $$props.handleUpsellVariantChange(e, $$props.upsellProduct);
  var root_31 = /* @__PURE__ */ from_html(`<option> </option>`);
  var root_30 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-select"><select class="moonbundle-cart-upsell-select__select" name="options"></select></div>`);
  var on_click_2 = (__3, $$props) => $$props.handleUpsellAddToCart($$props.upsellProduct);
  var root_33 = /* @__PURE__ */ from_html(`<div class="moonbundle-loading-overlay__spinner"><svg aria-hidden="true" focusable="false" class="moonbundle-spinner-rotator" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="moonbundle-circle-loader" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle></svg></div>`);
  var root_25$1 = /* @__PURE__ */ from_html(`<div><a><img class="moonbundle-cart-upsell-product-image"/></a> <div class="moonbundle-cart-upsell-product-details"><h4 class="moonbundle-cart-upsell-product-title"><a> </a></h4> <!> <!> <div class="moonbundle-cart-upsell-product-price-container"><!> <p class="moonbundle-cart-upsell-product-price"><!></p></div> <!> <button class="moonbundle-cart-upsell-add-to-cart-btn moonbundle-cart-upsell-add-to-cart-btn--full" data-action="add-upsell"><!></button></div></div>`);
  var root_36 = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-upsell-toggle-description"> </p>`);
  var root_38 = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-upsell-toggle-original-price"><!></p>`);
  var root_35 = /* @__PURE__ */ from_html(`<div><div class="moonbundle-cart-upsell-toggle-container"><div class="moonbundle-cart-upsell-toggle-image-container"><a><img class="moonbundle-cart-upsell-toggle-image"/></a></div> <div class="moonbundle-cart-upsell-toggle-content"><h4 class="moonbundle-cart-upsell-toggle-title"><a> </a></h4> <!> <!></div> <div class="moonbundle-cart-upsell-toggle-right"><div class="moonbundle-cart-upsell-toggle-price-container"><!> <p class="moonbundle-cart-upsell-toggle-price"><!></p></div> <label class="moonbundle-cart-upsell-toggle-switch"><input type="checkbox" data-action="add-upsell"/> <span class="moonbundle-cart-upsell-toggle-slider"></span></label></div></div></div>`);
  function UpsellProduct($$anchor, $$props) {
    push($$props, true);
    let isCurrent = prop($$props, "isCurrent", 3, true), layout = prop($$props, "layout", 3, "original");
    const subtitle = /* @__PURE__ */ user_derived(() => getTranslated("upsell.products." + $$props.upsellProduct.productId + ".subtitle") || $$props.getUpsellSubtitle($$props.upsellProduct));
    const buttonLabel = /* @__PURE__ */ user_derived(() => $$props.upsellProduct.availableForSale === false ? getTranslated("global.outOfStock") || $$props.cartDrawerProps?.globalTexts?.outOfStock || "Out of stock" : getTranslated("upsell.buttonTextUpsell") || $$props.cartDrawerProps?.upsellCart?.buttonTextUpsell || "");
    const isDisabled = /* @__PURE__ */ user_derived(() => $$props.cartDisabled || $$props.loadingUpsell || $$props.upsellProduct.availableForSale === false);
    const upsellLink = /* @__PURE__ */ user_derived(() => upsellProductLink($$props.upsellProduct));
    let isLeaving = /* @__PURE__ */ state(false);
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent_8 = ($$anchor2) => {
        var div = root_1$7();
        let classes;
        var div_1 = child(div);
        var div_2 = child(div_1);
        var a = child(div_2);
        let classes_1;
        a.__click = [onUpsellLinkClick, upsellLink];
        var img = child(a);
        var node_1 = sibling(div_2, 2);
        {
          var consequent_7 = ($$anchor3) => {
            var fragment_1 = root_2$5();
            var div_3 = first_child(fragment_1);
            var h4 = child(div_3);
            var a_1 = child(h4);
            let classes_2;
            a_1.__click = [onUpsellLinkClick, upsellLink];
            var text$1 = child(a_1);
            var node_2 = sibling(h4, 2);
            {
              var consequent = ($$anchor4) => {
                var p = root_3$5();
                var node_3 = child(p);
                html(node_3, () => getTranslated("upsell.products." + $$props.upsellProduct.productId + ".subtitle") || $$props.getUpsellSubtitle($$props.upsellProduct) || "");
                append($$anchor4, p);
              };
              if_block(node_2, ($$render) => {
                if (getTranslated("upsell.products." + $$props.upsellProduct.productId + ".subtitle") || $$props.getUpsellSubtitle($$props.upsellProduct)) $$render(consequent);
              });
            }
            var node_4 = sibling(node_2, 2);
            {
              var consequent_1 = ($$anchor4) => {
                ItemReviews($$anchor4, {
                  get reviewRating() {
                    return $$props.upsellProduct.reviewRating;
                  },
                  get reviewCount() {
                    return $$props.upsellProduct.reviewCount;
                  }
                });
              };
              if_block(node_4, ($$render) => {
                if ($$props.cartDrawerProps?.upsellCart?.showUpsellReviews) $$render(consequent_1);
              });
            }
            var div_4 = sibling(node_4, 2);
            var node_5 = child(div_4);
            {
              var consequent_2 = ($$anchor4) => {
                var p_1 = root_5$2();
                var node_6 = child(p_1);
                html(node_6, () => $$props.shopifyFormatCurrency($$props.getUpsellOriginalPrice($$props.upsellProduct)));
                append($$anchor4, p_1);
              };
              if_block(node_5, ($$render) => {
                if ($$props.getUpsellOriginalPrice($$props.upsellProduct) > $$props.getUpsellFinalPrice($$props.upsellProduct)) $$render(consequent_2);
              });
            }
            var p_2 = sibling(node_5, 2);
            var node_7 = child(p_2);
            html(node_7, () => $$props.shopifyFormatCurrency($$props.getUpsellFinalPrice($$props.upsellProduct)));
            var node_8 = sibling(div_4, 2);
            {
              var consequent_4 = ($$anchor4) => {
                var fragment_3 = comment();
                const combinations = /* @__PURE__ */ user_derived(() => $$props.generateOptionCombinations($$props.upsellProduct.optionsValuesEnriched));
                const defaultCombination = /* @__PURE__ */ user_derived(() => $$props.getDefaultCombination($$props.upsellProduct));
                var node_9 = first_child(fragment_3);
                {
                  var consequent_3 = ($$anchor5) => {
                    var div_5 = root_7$2();
                    var div_6 = child(div_5);
                    var div_7 = child(div_6);
                    var select = child(div_7);
                    select.__change = [on_change$1, $$props];
                    each(select, 21, () => get(combinations), index, ($$anchor6, combination) => {
                      var option = root_8();
                      var text_1 = child(option);
                      var option_value = {};
                      template_effect(() => {
                        set_selected(option, get(combination) === get(defaultCombination));
                        set_text(text_1, get(combination));
                        if (option_value !== (option_value = get(combination))) {
                          option.value = (option.__value = get(combination)) ?? "";
                        }
                      });
                      append($$anchor6, option);
                    });
                    template_effect(() => {
                      set_attribute(select, "id", `Option-${$$props.index ?? ""}`);
                      set_attribute(select, "data-item-key", $$props.upsellProduct.key);
                      set_attribute(select, "data-product-id", $$props.upsellProduct.productId || "");
                      set_attribute(select, "data-id-merchandise-line", $$props.upsellProduct.variant_id || "");
                    });
                    append($$anchor5, div_5);
                  };
                  if_block(node_9, ($$render) => {
                    if (get(combinations).length > 1) $$render(consequent_3);
                  });
                }
                append($$anchor4, fragment_3);
              };
              if_block(node_8, ($$render) => {
                if ($$props.upsellProduct.optionsValuesEnriched?.length) $$render(consequent_4);
              });
            }
            var div_8 = sibling(div_3, 2);
            let classes_3;
            var node_10 = child(div_8);
            {
              var consequent_5 = ($$anchor4) => {
                var p_3 = root_9$1();
                var text_2 = child(p_3);
                template_effect(($0) => set_text(text_2, $0), [() => $$props.formatDiscountDisplay($$props.upsellProduct)]);
                append($$anchor4, p_3);
              };
              if_block(node_10, ($$render) => {
                if ($$props.getUpsellDiscountAmount($$props.upsellProduct) > 0) $$render(consequent_5);
              });
            }
            var button = sibling(node_10, 2);
            button.__click = [on_click$1, $$props];
            var node_11 = child(button);
            {
              var consequent_6 = ($$anchor4) => {
                var text_3 = text();
                template_effect(() => set_text(text_3, get(buttonLabel)));
                append($$anchor4, text_3);
              };
              var alternate = ($$anchor4) => {
                var div_9 = root_11();
                append($$anchor4, div_9);
              };
              if_block(node_11, ($$render) => {
                if (!$$props.loadingUpsell) $$render(consequent_6);
                else $$render(alternate, false);
              });
            }
            template_effect(
              ($0, $1) => {
                classes_2 = set_class(a_1, 1, "moonbundle-cart-upsell-product-title-link", null, classes_2, $0);
                set_attribute(a_1, "href", get(upsellLink).href);
                set_attribute(a_1, "aria-disabled", !get(upsellLink).navigable);
                set_text(text$1, $$props.upsellProduct.product_title);
                classes_3 = set_class(div_8, 1, "moonbundle-cart-upsell-product-add-to-cart-container", null, classes_3, $1);
                set_attribute(button, "data-product-id", $$props.upsellProduct.productId);
                set_attribute(button, "data-variant-id", $$props.upsellProduct.variant_id);
                set_attribute(button, "data-product-key", $$props.upsellProduct.key);
                button.disabled = get(isDisabled);
              },
              [
                () => ({
                  "moonbundle-cart-link--non-navigable": !get(upsellLink).navigable
                }),
                () => ({
                  "moonbundle-cart-upsell-has-discount": $$props.getUpsellDiscountAmount($$props.upsellProduct) > 0
                })
              ]
            );
            append($$anchor3, fragment_1);
          };
          if_block(node_1, ($$render) => {
            if (isCurrent()) $$render(consequent_7);
          });
        }
        template_effect(
          ($0, $1, $2) => {
            set_attribute(div, "id", `Upsell-Product-${$$props.index ?? ""}${isCurrent() ? "" : "-preview"}`);
            classes = set_class(div, 1, `moonbundle-cart-upsell-product moonbundle-cart-upsell-product--${layout() ?? ""}`, null, classes, $0);
            set_attribute(div, "data-product-id", $$props.upsellProduct.productId);
            set_attribute(div, "data-variant-id", $$props.upsellProduct.variant_id);
            classes_1 = set_class(a, 1, "moonbundle-cart-upsell-product-image-link", null, classes_1, $1);
            set_attribute(a, "href", get(upsellLink).href);
            set_attribute(a, "aria-disabled", !get(upsellLink).navigable);
            set_attribute(img, "src", $2);
            set_attribute(img, "alt", $$props.upsellProduct.product_title ?? "");
          },
          [
            () => ({
              "moonbundle-cart-upsell-product-current": isCurrent(),
              "moonbundle-cart-upsell-product-next": !isCurrent()
            }),
            () => ({
              "moonbundle-cart-link--non-navigable": !get(upsellLink).navigable
            }),
            () => $$props.getUpsellImageSource($$props.upsellProduct)
          ]
        );
        append($$anchor2, div);
      };
      var alternate_5 = ($$anchor2) => {
        var fragment_5 = comment();
        var node_12 = first_child(fragment_5);
        {
          var consequent_17 = ($$anchor3) => {
            var div_10 = root_13$1();
            let classes_4;
            var div_11 = child(div_10);
            var a_2 = child(div_11);
            let classes_5;
            a_2.__click = [onUpsellLinkClick, upsellLink];
            var img_1 = child(a_2);
            var node_13 = sibling(a_2, 2);
            {
              var consequent_10 = ($$anchor4) => {
                var button_1 = root_14();
                button_1.__click = [on_click_1, $$props];
                var node_14 = child(button_1);
                {
                  var consequent_9 = ($$anchor5) => {
                    var div_12 = root_15$2();
                    append($$anchor5, div_12);
                  };
                  var alternate_1 = ($$anchor5) => {
                    var svg = root_16();
                    append($$anchor5, svg);
                  };
                  if_block(node_14, ($$render) => {
                    if ($$props.loadingUpsell) $$render(consequent_9);
                    else $$render(alternate_1, false);
                  });
                }
                template_effect(() => {
                  set_attribute(button_1, "data-product-id", $$props.upsellProduct.productId);
                  set_attribute(button_1, "data-variant-id", $$props.upsellProduct.variant_id);
                  set_attribute(button_1, "data-product-key", $$props.upsellProduct.key);
                  button_1.disabled = get(isDisabled);
                  set_attribute(button_1, "aria-label", get(buttonLabel));
                });
                append($$anchor4, button_1);
              };
              if_block(node_13, ($$render) => {
                if (isCurrent()) $$render(consequent_10);
              });
            }
            var node_15 = sibling(div_11, 2);
            {
              var consequent_16 = ($$anchor4) => {
                var div_13 = root_17();
                var h4_1 = child(div_13);
                var a_3 = child(h4_1);
                let classes_6;
                a_3.__click = [onUpsellLinkClick, upsellLink];
                var text_4 = child(a_3);
                var node_16 = sibling(h4_1, 2);
                {
                  var consequent_11 = ($$anchor5) => {
                    var p_4 = root_18();
                    var text_5 = child(p_4);
                    template_effect(() => set_text(text_5, get(subtitle)));
                    append($$anchor5, p_4);
                  };
                  if_block(node_16, ($$render) => {
                    if (get(subtitle)) $$render(consequent_11);
                  });
                }
                var node_17 = sibling(node_16, 2);
                {
                  var consequent_12 = ($$anchor5) => {
                    ItemReviews($$anchor5, {
                      get reviewRating() {
                        return $$props.upsellProduct.reviewRating;
                      },
                      get reviewCount() {
                        return $$props.upsellProduct.reviewCount;
                      }
                    });
                  };
                  if_block(node_17, ($$render) => {
                    if ($$props.cartDrawerProps?.upsellCart?.showUpsellReviews) $$render(consequent_12);
                  });
                }
                var div_14 = sibling(node_17, 2);
                var node_18 = child(div_14);
                {
                  var consequent_13 = ($$anchor5) => {
                    var p_5 = root_20();
                    var node_19 = child(p_5);
                    html(node_19, () => $$props.shopifyFormatCurrency($$props.getUpsellOriginalPrice($$props.upsellProduct)));
                    append($$anchor5, p_5);
                  };
                  if_block(node_18, ($$render) => {
                    if ($$props.getUpsellOriginalPrice($$props.upsellProduct) > $$props.getUpsellFinalPrice($$props.upsellProduct)) $$render(consequent_13);
                  });
                }
                var p_6 = sibling(node_18, 2);
                var node_20 = child(p_6);
                html(node_20, () => $$props.shopifyFormatCurrency($$props.getUpsellFinalPrice($$props.upsellProduct)));
                var node_21 = sibling(div_14, 2);
                {
                  var consequent_15 = ($$anchor5) => {
                    var fragment_7 = comment();
                    const combinations = /* @__PURE__ */ user_derived(() => $$props.generateOptionCombinations($$props.upsellProduct.optionsValuesEnriched));
                    const defaultCombination = /* @__PURE__ */ user_derived(() => $$props.getDefaultCombination($$props.upsellProduct));
                    var node_22 = first_child(fragment_7);
                    {
                      var consequent_14 = ($$anchor6) => {
                        var div_15 = root_22();
                        var select_1 = child(div_15);
                        select_1.__change = [on_change_1, $$props];
                        each(select_1, 21, () => get(combinations), index, ($$anchor7, combination) => {
                          var option_1 = root_23();
                          var text_6 = child(option_1);
                          var option_1_value = {};
                          template_effect(() => {
                            set_selected(option_1, get(combination) === get(defaultCombination));
                            set_text(text_6, get(combination));
                            if (option_1_value !== (option_1_value = get(combination))) {
                              option_1.value = (option_1.__value = get(combination)) ?? "";
                            }
                          });
                          append($$anchor7, option_1);
                        });
                        template_effect(() => {
                          set_attribute(select_1, "id", `Option-${$$props.index ?? ""}`);
                          set_attribute(select_1, "data-item-key", $$props.upsellProduct.key);
                          set_attribute(select_1, "data-product-id", $$props.upsellProduct.productId || "");
                          set_attribute(select_1, "data-id-merchandise-line", $$props.upsellProduct.variant_id || "");
                        });
                        append($$anchor6, div_15);
                      };
                      if_block(node_22, ($$render) => {
                        if (get(combinations).length > 1) $$render(consequent_14);
                      });
                    }
                    append($$anchor5, fragment_7);
                  };
                  if_block(node_21, ($$render) => {
                    if ($$props.upsellProduct.optionsValuesEnriched?.length) $$render(consequent_15);
                  });
                }
                template_effect(
                  ($0) => {
                    classes_6 = set_class(a_3, 1, "moonbundle-cart-upsell-product-title-link", null, classes_6, $0);
                    set_attribute(a_3, "href", get(upsellLink).href);
                    set_attribute(a_3, "aria-disabled", !get(upsellLink).navigable);
                    set_text(text_4, $$props.upsellProduct.product_title);
                  },
                  [
                    () => ({
                      "moonbundle-cart-link--non-navigable": !get(upsellLink).navigable
                    })
                  ]
                );
                append($$anchor4, div_13);
              };
              if_block(node_15, ($$render) => {
                if (isCurrent()) $$render(consequent_16);
              });
            }
            template_effect(
              ($0, $1, $2) => {
                set_attribute(div_10, "id", `Upsell-Product-${$$props.index ?? ""}${isCurrent() ? "" : "-preview"}`);
                classes_4 = set_class(div_10, 1, "moonbundle-cart-upsell-product moonbundle-cart-upsell-product--sliderPlus", null, classes_4, $0);
                set_attribute(div_10, "data-product-id", $$props.upsellProduct.productId);
                set_attribute(div_10, "data-variant-id", $$props.upsellProduct.variant_id);
                classes_5 = set_class(a_2, 1, "moonbundle-cart-upsell-product-image-link", null, classes_5, $1);
                set_attribute(a_2, "href", get(upsellLink).href);
                set_attribute(a_2, "aria-disabled", !get(upsellLink).navigable);
                set_attribute(img_1, "src", $2);
                set_attribute(img_1, "alt", $$props.upsellProduct.product_title ?? "");
              },
              [
                () => ({
                  "moonbundle-cart-upsell-product-current": isCurrent(),
                  "moonbundle-cart-upsell-product-next": !isCurrent()
                }),
                () => ({
                  "moonbundle-cart-link--non-navigable": !get(upsellLink).navigable
                }),
                () => $$props.getUpsellImageSource($$props.upsellProduct)
              ]
            );
            append($$anchor3, div_10);
          };
          var alternate_4 = ($$anchor3) => {
            var fragment_8 = comment();
            var node_23 = first_child(fragment_8);
            {
              var consequent_24 = ($$anchor4) => {
                var div_16 = root_25$1();
                let classes_7;
                var a_4 = child(div_16);
                let classes_8;
                a_4.__click = [onUpsellLinkClick, upsellLink];
                var img_2 = child(a_4);
                var div_17 = sibling(a_4, 2);
                var h4_2 = child(div_17);
                var a_5 = child(h4_2);
                let classes_9;
                a_5.__click = [onUpsellLinkClick, upsellLink];
                var text_7 = child(a_5);
                var node_24 = sibling(h4_2, 2);
                {
                  var consequent_18 = ($$anchor5) => {
                    var p_7 = root_26();
                    var text_8 = child(p_7);
                    template_effect(() => set_text(text_8, get(subtitle)));
                    append($$anchor5, p_7);
                  };
                  if_block(node_24, ($$render) => {
                    if (get(subtitle)) $$render(consequent_18);
                  });
                }
                var node_25 = sibling(node_24, 2);
                {
                  var consequent_19 = ($$anchor5) => {
                    ItemReviews($$anchor5, {
                      get reviewRating() {
                        return $$props.upsellProduct.reviewRating;
                      },
                      get reviewCount() {
                        return $$props.upsellProduct.reviewCount;
                      }
                    });
                  };
                  if_block(node_25, ($$render) => {
                    if ($$props.cartDrawerProps?.upsellCart?.showUpsellReviews) $$render(consequent_19);
                  });
                }
                var div_18 = sibling(node_25, 2);
                var node_26 = child(div_18);
                {
                  var consequent_20 = ($$anchor5) => {
                    var p_8 = root_28();
                    var node_27 = child(p_8);
                    html(node_27, () => $$props.shopifyFormatCurrency($$props.getUpsellOriginalPrice($$props.upsellProduct)));
                    append($$anchor5, p_8);
                  };
                  if_block(node_26, ($$render) => {
                    if ($$props.getUpsellOriginalPrice($$props.upsellProduct) > $$props.getUpsellFinalPrice($$props.upsellProduct)) $$render(consequent_20);
                  });
                }
                var p_9 = sibling(node_26, 2);
                var node_28 = child(p_9);
                html(node_28, () => $$props.shopifyFormatCurrency($$props.getUpsellFinalPrice($$props.upsellProduct)));
                var node_29 = sibling(div_18, 2);
                {
                  var consequent_22 = ($$anchor5) => {
                    var fragment_10 = comment();
                    const combinations = /* @__PURE__ */ user_derived(() => $$props.generateOptionCombinations($$props.upsellProduct.optionsValuesEnriched));
                    const defaultCombination = /* @__PURE__ */ user_derived(() => $$props.getDefaultCombination($$props.upsellProduct));
                    var node_30 = first_child(fragment_10);
                    {
                      var consequent_21 = ($$anchor6) => {
                        var div_19 = root_30();
                        var select_2 = child(div_19);
                        select_2.__change = [on_change_2, $$props];
                        each(select_2, 21, () => get(combinations), index, ($$anchor7, combination) => {
                          var option_2 = root_31();
                          var text_9 = child(option_2);
                          var option_2_value = {};
                          template_effect(() => {
                            set_selected(option_2, get(combination) === get(defaultCombination));
                            set_text(text_9, get(combination));
                            if (option_2_value !== (option_2_value = get(combination))) {
                              option_2.value = (option_2.__value = get(combination)) ?? "";
                            }
                          });
                          append($$anchor7, option_2);
                        });
                        template_effect(() => {
                          set_attribute(select_2, "id", `Option-${$$props.index ?? ""}`);
                          set_attribute(select_2, "data-item-key", $$props.upsellProduct.key);
                          set_attribute(select_2, "data-product-id", $$props.upsellProduct.productId || "");
                          set_attribute(select_2, "data-id-merchandise-line", $$props.upsellProduct.variant_id || "");
                        });
                        append($$anchor6, div_19);
                      };
                      if_block(node_30, ($$render) => {
                        if (get(combinations).length > 1) $$render(consequent_21);
                      });
                    }
                    append($$anchor5, fragment_10);
                  };
                  if_block(node_29, ($$render) => {
                    if ($$props.upsellProduct.optionsValuesEnriched?.length) $$render(consequent_22);
                  });
                }
                var button_2 = sibling(node_29, 2);
                button_2.__click = [on_click_2, $$props];
                var node_31 = child(button_2);
                {
                  var consequent_23 = ($$anchor5) => {
                    var text_10 = text();
                    template_effect(() => set_text(text_10, get(buttonLabel)));
                    append($$anchor5, text_10);
                  };
                  var alternate_2 = ($$anchor5) => {
                    var div_20 = root_33();
                    append($$anchor5, div_20);
                  };
                  if_block(node_31, ($$render) => {
                    if (!$$props.loadingUpsell) $$render(consequent_23);
                    else $$render(alternate_2, false);
                  });
                }
                template_effect(
                  ($0, $1, $2, $3) => {
                    set_attribute(div_16, "id", `Upsell-Product-${$$props.index ?? ""}${isCurrent() ? "" : "-preview"}`);
                    classes_7 = set_class(div_16, 1, "moonbundle-cart-upsell-product--sliderClassic", null, classes_7, $0);
                    set_attribute(div_16, "data-product-id", $$props.upsellProduct.productId);
                    set_attribute(div_16, "data-variant-id", $$props.upsellProduct.variant_id);
                    classes_8 = set_class(a_4, 1, "moonbundle-cart-upsell-product-image-link", null, classes_8, $1);
                    set_attribute(a_4, "href", get(upsellLink).href);
                    set_attribute(a_4, "aria-disabled", !get(upsellLink).navigable);
                    set_attribute(img_2, "src", $2);
                    set_attribute(img_2, "alt", $$props.upsellProduct.product_title ?? "");
                    classes_9 = set_class(a_5, 1, "moonbundle-cart-upsell-product-title-link", null, classes_9, $3);
                    set_attribute(a_5, "href", get(upsellLink).href);
                    set_attribute(a_5, "aria-disabled", !get(upsellLink).navigable);
                    set_text(text_7, $$props.upsellProduct.product_title);
                    set_attribute(button_2, "data-product-id", $$props.upsellProduct.productId);
                    set_attribute(button_2, "data-variant-id", $$props.upsellProduct.variant_id);
                    set_attribute(button_2, "data-product-key", $$props.upsellProduct.key);
                    button_2.disabled = get(isDisabled);
                  },
                  [
                    () => ({ "moonbundle-cart-upsell-product-current": isCurrent() }),
                    () => ({
                      "moonbundle-cart-link--non-navigable": !get(upsellLink).navigable
                    }),
                    () => $$props.getUpsellImageSource($$props.upsellProduct),
                    () => ({
                      "moonbundle-cart-link--non-navigable": !get(upsellLink).navigable
                    })
                  ]
                );
                append($$anchor4, div_16);
              };
              var alternate_3 = ($$anchor4) => {
                var fragment_12 = comment();
                var node_32 = first_child(fragment_12);
                {
                  var consequent_28 = ($$anchor5) => {
                    var div_21 = root_35();
                    let classes_10;
                    var div_22 = child(div_21);
                    var div_23 = child(div_22);
                    var a_6 = child(div_23);
                    let classes_11;
                    a_6.__click = [onUpsellLinkClick, upsellLink];
                    var img_3 = child(a_6);
                    var div_24 = sibling(div_23, 2);
                    var h4_3 = child(div_24);
                    var a_7 = child(h4_3);
                    let classes_12;
                    a_7.__click = [onUpsellLinkClick, upsellLink];
                    var text_11 = child(a_7);
                    var node_33 = sibling(h4_3, 2);
                    {
                      var consequent_25 = ($$anchor6) => {
                        var p_10 = root_36();
                        var text_12 = child(p_10);
                        template_effect(() => set_text(text_12, get(subtitle)));
                        append($$anchor6, p_10);
                      };
                      if_block(node_33, ($$render) => {
                        if (get(subtitle)) $$render(consequent_25);
                      });
                    }
                    var node_34 = sibling(node_33, 2);
                    {
                      var consequent_26 = ($$anchor6) => {
                        ItemReviews($$anchor6, {
                          get reviewRating() {
                            return $$props.upsellProduct.reviewRating;
                          },
                          get reviewCount() {
                            return $$props.upsellProduct.reviewCount;
                          }
                        });
                      };
                      if_block(node_34, ($$render) => {
                        if ($$props.cartDrawerProps?.upsellCart?.showUpsellReviews) $$render(consequent_26);
                      });
                    }
                    var div_25 = sibling(div_24, 2);
                    var div_26 = child(div_25);
                    var node_35 = child(div_26);
                    {
                      var consequent_27 = ($$anchor6) => {
                        var p_11 = root_38();
                        var node_36 = child(p_11);
                        html(node_36, () => $$props.shopifyFormatCurrency($$props.getUpsellOriginalPrice($$props.upsellProduct)));
                        append($$anchor6, p_11);
                      };
                      if_block(node_35, ($$render) => {
                        if ($$props.getUpsellOriginalPrice($$props.upsellProduct) > $$props.getUpsellFinalPrice($$props.upsellProduct)) $$render(consequent_27);
                      });
                    }
                    var p_12 = sibling(node_35, 2);
                    var node_37 = child(p_12);
                    html(node_37, () => $$props.shopifyFormatCurrency($$props.getUpsellFinalPrice($$props.upsellProduct)));
                    var label = sibling(div_26, 2);
                    var input = child(label);
                    input.__change = [handleToggleChange, isDisabled, isLeaving, $$props];
                    template_effect(
                      ($0, $1, $2, $3) => {
                        set_attribute(div_21, "id", `Upsell-Product-${$$props.index ?? ""}${isCurrent() ? "" : "-preview"}`);
                        classes_10 = set_class(div_21, 1, "moonbundle-cart-upsell-toggle-section", null, classes_10, $0);
                        set_attribute(div_21, "data-product-id", $$props.upsellProduct.productId);
                        set_attribute(div_21, "data-variant-id", $$props.upsellProduct.variant_id);
                        classes_11 = set_class(a_6, 1, "moonbundle-cart-upsell-toggle-image-link", null, classes_11, $1);
                        set_attribute(a_6, "href", get(upsellLink).href);
                        set_attribute(a_6, "aria-disabled", !get(upsellLink).navigable);
                        set_attribute(img_3, "src", $2);
                        set_attribute(img_3, "alt", $$props.upsellProduct.product_title ?? "");
                        classes_12 = set_class(a_7, 1, "moonbundle-cart-upsell-toggle-title-link", null, classes_12, $3);
                        set_attribute(a_7, "href", get(upsellLink).href);
                        set_attribute(a_7, "aria-disabled", !get(upsellLink).navigable);
                        set_text(text_11, $$props.upsellProduct.product_title);
                        input.disabled = get(isDisabled) || get(isLeaving);
                        set_attribute(input, "data-product-id", $$props.upsellProduct.productId);
                        set_attribute(input, "data-variant-id", $$props.upsellProduct.variant_id);
                        set_attribute(input, "data-product-key", $$props.upsellProduct.key);
                      },
                      [
                        () => ({
                          "moonbundle-cart-upsell-toggle-section--leaving": get(isLeaving)
                        }),
                        () => ({
                          "moonbundle-cart-link--non-navigable": !get(upsellLink).navigable
                        }),
                        () => $$props.getUpsellImageSource($$props.upsellProduct),
                        () => ({
                          "moonbundle-cart-link--non-navigable": !get(upsellLink).navigable
                        })
                      ]
                    );
                    append($$anchor5, div_21);
                  };
                  if_block(
                    node_32,
                    ($$render) => {
                      if (layout() === "toggle") $$render(consequent_28);
                    },
                    true
                  );
                }
                append($$anchor4, fragment_12);
              };
              if_block(
                node_23,
                ($$render) => {
                  if (layout() === "sliderClassic") $$render(consequent_24);
                  else $$render(alternate_3, false);
                },
                true
              );
            }
            append($$anchor3, fragment_8);
          };
          if_block(
            node_12,
            ($$render) => {
              if (layout() === "sliderPlus") $$render(consequent_17);
              else $$render(alternate_4, false);
            },
            true
          );
        }
        append($$anchor2, fragment_5);
      };
      if_block(node, ($$render) => {
        if (layout() === "original" || layout() === "vertical") $$render(consequent_8);
        else $$render(alternate_5, false);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["click", "change"]);
  var root_4$1 = /* @__PURE__ */ from_html(`<span class="moonbundle-cart-upsell-title-icon"><!></span>`);
  var root_2$4 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-title-icons"></div>`);
  var root_1$6 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-header"><div class="moonbundle-cart-upsell-title-row"><!> <div class="moonbundle-cart-upsell-title"><!></div></div> <!></div>`);
  var root_6$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-loading"><div class="moonbundle-loading-overlay__spinner"><svg aria-hidden="true" focusable="false" class="moonbundle-spinner-rotator" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="moonbundle-circle-loader" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle></svg></div></div>`);
  var root_9 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-products-wrapper moonbundle-cart-upsell-products-wrapper--stacked"></div>`);
  var root_12 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-products-wrapper moonbundle-cart-upsell-products-wrapper--sliderPlus"></div>`);
  var root_15$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-products-wrapper moonbundle-cart-upsell-products-wrapper--sliderClassic"></div>`);
  var root_19$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-products-wrapper moonbundle-cart-upsell-products-wrapper--toggle"><!></div>`);
  var root_21 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell-products-wrapper"><!> <!></div>`);
  var root$9 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-upsell"><!> <div class="moonbundle-cart-upsell-products"><!></div></div>`);
  function CartUpsells($$anchor, $$props) {
    push($$props, true);
    let listUpsellIcons = prop($$props, "listUpsellIcons", 19, () => ({})), currencyRate = prop($$props, "currencyRate", 3, 1);
    prop($$props, "isPreview", 3, false);
    let shop = prop($$props, "shop", 3, null), locale = prop($$props, "locale", 3, null), country = prop($$props, "country", 3, null);
    let aiRecommendations = /* @__PURE__ */ state(proxy([]));
    let isLoadingRecommendations = /* @__PURE__ */ state(false);
    let activeUpsellData = /* @__PURE__ */ user_derived(() => {
      if ($$props.cartDrawerProps?.upsellCart?.upsellMode === "ai") return get(aiRecommendations);
      const products = $$props.upsellProductsData ?? [];
      const configOrder = $$props.cartDrawerProps?.upsellCart?.upsellProducts ?? [];
      if (configOrder.length === 0) return products;
      return [...products].sort((a, b) => {
        const indexA = configOrder.findIndex((p) => p.productId === a.productId);
        const indexB = configOrder.findIndex((p) => p.productId === b.productId);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    });
    async function onUpsellVariantChange(event, upsellProduct) {
      const updated = await $$props.handleUpsellVariantChange(event, upsellProduct);
      if (updated && $$props.cartDrawerProps?.upsellCart?.upsellMode === "ai" && upsellProduct.productId) {
        set(aiRecommendations, get(aiRecommendations).map((p) => p.productId === upsellProduct.productId ? updated : p), true);
      }
    }
    user_effect(() => {
      const mode = $$props.cartDrawerProps?.upsellCart?.upsellMode;
      const intent = $$props.cartDrawerProps?.upsellCart?.recommendationIntent ?? "related";
      if (mode !== "ai") {
        set(aiRecommendations, [], true);
        return;
      }
      const cartItems = $$props.cart?.items?.filter((item) => !item.properties?._moonBundleCart) ?? [];
      if (cartItems.length === 0) return;
      const seenIds = /* @__PURE__ */ new Set();
      const uniqueItems = cartItems.filter((item) => {
        const id = item.productId ?? "";
        if (!id || seenIds.has(id)) return false;
        seenIds.add(id);
        return true;
      });
      if (uniqueItems.length === 0) return;
      const controller = new AbortController();
      set(isLoadingRecommendations, true);
      const storefrontToken = $$props.cartDrawerProps?.storefrontToken ?? "";
      const cartProductIds = new Set(uniqueItems.map((i) => normalizeShopifyId(i.productId ?? "")));
      const maxToShow = $$props.cartDrawerProps?.upsellCart?.maxUpsellsToDisplay ?? 10;
      const fetchPromises = uniqueItems.map((item) => {
        const productGid = item.productId?.startsWith("gid://") ? item.productId : `gid://shopify/Product/${item.productId}`;
        return fetchProductRecommendations(productGid, intent, country(), locale(), storefrontToken, shop());
      });
      Promise.all(fetchPromises).then((resultsPerProduct) => {
        if (controller.signal.aborted) return;
        const seenProductIds = /* @__PURE__ */ new Set();
        const combinedProducts = [];
        for (const products of resultsPerProduct) {
          for (const p of products) {
            const normalizedId = normalizeShopifyId(p.id);
            if (!cartProductIds.has(normalizedId) && !seenProductIds.has(normalizedId)) {
              seenProductIds.add(normalizedId);
              combinedProducts.push(p);
            }
          }
        }
        set(
          aiRecommendations,
          combinedProducts.map((p) => {
            const variant = p.selectedOrFirstAvailableVariant ?? {};
            const variantNumericId = parseInt(variant.id?.split("/").pop() ?? "0");
            const variantPrice = Math.round(parseFloat(variant.price?.amount ?? "0") * 100);
            const compareAtPrice = variant.compareAtPrice?.amount ? Math.round(parseFloat(variant.compareAtPrice.amount) * 100) : void 0;
            const optionsValuesEnriched = (p.options ?? []).map((opt) => ({
              name: opt.name,
              value: (opt.optionValues ?? []).map((v) => v.name)
            }));
            const allocationNodes = variant.sellingPlanAllocations?.nodes ?? [];
            const subscriptionData = allocationNodes.length > 0 ? [
              {
                sellingPlans: allocationNodes.map((node) => {
                  const plan = node.sellingPlan;
                  return {
                    id: parseInt(plan.id?.split("/").pop() ?? "0") || null,
                    name: plan.name ?? "",
                    priceAdjustments: (plan.priceAdjustments ?? []).map((adj) => {
                      const val = adj.adjustmentValue;
                      return {
                        adjustmentValue: {
                          adjustmentPercentage: val.__typename === "SellingPlanPercentagePriceAdjustment" ? val.adjustmentPercentage : void 0,
                          adjustmentAmount: val.__typename === "SellingPlanFixedAmountPriceAdjustment" ? parseFloat(val.adjustmentAmount?.amount ?? "0") : void 0,
                          price: val.__typename === "SellingPlanFixedPriceAdjustment" ? parseFloat(val.price?.amount ?? "0") : void 0
                        }
                      };
                    })
                  };
                })
              }
            ] : [];
            return {
              key: String(variantNumericId || p.id),
              productId: p.id,
              product_title: p.title,
              handle: p.handle,
              url: productVariantUrlFromOnlineStoreUrl(p.onlineStoreUrl, variantNumericId),
              image: variant.image?.transformedUrl ?? p.featuredImage?.transformedUrl ?? "",
              variant_id: variantNumericId,
              original_line_price: variantPrice,
              final_line_price: variantPrice,
              compare_at_price: compareAtPrice,
              discountAmount: "0",
              discountType: "percentage",
              availableForSale: variant.availableForSale ?? p.availableForSale ?? true,
              options_with_values: (variant.selectedOptions ?? []).map((opt) => ({ name: opt.name, value: opt.value })),
              optionsValuesEnriched: optionsValuesEnriched.length > 0 ? optionsValuesEnriched : null,
              subscriptionData: subscriptionData.length > 0 ? subscriptionData : void 0
            };
          }).slice(0, maxToShow),
          true
        );
      }).catch((error) => {
        if (!controller.signal.aborted) {
          console.error("Error fetching AI recommendations (GraphQL):", error);
        }
      }).finally(() => {
        if (!controller.signal.aborted) set(isLoadingRecommendations, false);
      });
      return () => {
        controller.abort();
      };
    });
    function normalizeShopifyId(id) {
      return id?.split("/").pop() ?? id;
    }
    function matchesTriggerProduct(triggerProduct) {
      const triggerProductId = normalizeShopifyId(triggerProduct.productId);
      return $$props.cart?.items?.some((item) => {
        const cartProductId = normalizeShopifyId(item.productId ?? "");
        if (cartProductId !== triggerProductId) return false;
        if (!triggerProduct.variantIds || triggerProduct.variantIds.length === 0) {
          return true;
        }
        const cartVariantId = String(item.variant_id);
        return triggerProduct.variantIds.some((vid) => normalizeShopifyId(vid) === cartVariantId);
      }) ?? false;
    }
    function isUpsellVisibleByProductTrigger(config) {
      if (config?.trigger?.excludedProducts && config.trigger.excludedProducts.length > 0) {
        const isExcluded = config.trigger.excludedProducts.some((excludedProduct) => matchesTriggerProduct(excludedProduct));
        if (isExcluded) return false;
      }
      if (!config?.trigger?.products || config.trigger.products.length === 0) {
        return true;
      }
      return config.trigger.products.some((triggerProduct) => matchesTriggerProduct(triggerProduct));
    }
    function isUpsellVisibleByAmountTrigger(config) {
      const type = config?.trigger?.amountTotalOrderType;
      const value = config?.trigger?.amountTotalOrder;
      if (!type || value == null) return true;
      const cartTotal = ($$props.cart?.total_price ?? 0) / 100;
      const threshold = value * currencyRate();
      if (type === "moreThan") return cartTotal > threshold;
      if (type === "lessThan") return cartTotal < threshold;
      return true;
    }
    function isUpsellVisibleByQuantityTrigger(config) {
      const type = config?.trigger?.amountQuantityOrderType;
      const value = config?.trigger?.amountQuantityOrder;
      if (!type || value == null) return true;
      const cartQuantity = $$props.cart?.item_count ?? 0;
      if (type === "moreThan") return cartQuantity > value;
      if (type === "lessThan") return cartQuantity < value;
      if (type === "equalTo") return cartQuantity === value;
      return true;
    }
    function getUpsellConfig(upsellProduct) {
      return $$props.cartDrawerProps?.upsellCart?.upsellProducts?.find((p) => p.productId === upsellProduct.productId);
    }
    let filteredUpsellData = /* @__PURE__ */ user_derived(() => get(activeUpsellData).filter((p) => {
      const config = getUpsellConfig(p);
      return isUpsellVisibleByProductTrigger(config) && isUpsellVisibleByAmountTrigger(config) && isUpsellVisibleByQuantityTrigger(config);
    }));
    let safeCurrentIndex = /* @__PURE__ */ user_derived(() => get(filteredUpsellData).length > 0 ? Math.min($$props.currentUpsellIndex, get(filteredUpsellData).length - 1) : 0);
    user_effect(() => {
      $$props.ontotalchange?.(get(filteredUpsellData).length);
    });
    let layout = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.upsellCart?.upsellLayout ?? "original");
    let showNavigation = /* @__PURE__ */ user_derived(() => get(layout) !== "toggle" && get(filteredUpsellData).length > 1 && (get(layout) !== "vertical" || get(filteredUpsellData).length > 3) && (get(layout) !== "sliderPlus" || get(filteredUpsellData).length > 3) && (get(layout) !== "sliderClassic" || get(filteredUpsellData).length > 2));
    const VERTICAL_PAGE_SIZE = 3;
    let verticalPage = /* @__PURE__ */ state(0);
    let verticalTotalPages = /* @__PURE__ */ user_derived(() => Math.ceil(get(filteredUpsellData).length / VERTICAL_PAGE_SIZE));
    let verticalPageProducts = /* @__PURE__ */ user_derived(() => get(filteredUpsellData).slice(get(verticalPage) * VERTICAL_PAGE_SIZE, (get(verticalPage) + 1) * VERTICAL_PAGE_SIZE));
    user_effect(() => {
      if (get(verticalPage) >= get(verticalTotalPages) && get(verticalTotalPages) > 0) {
        set(verticalPage, 0);
      }
    });
    function nextVerticalPage() {
      set(verticalPage, (get(verticalPage) + 1) % get(verticalTotalPages));
    }
    function prevVerticalPage() {
      set(verticalPage, (get(verticalPage) - 1 + get(verticalTotalPages)) % get(verticalTotalPages));
    }
    const SLIDER_CLASSIC_PAGE_SIZE = 2;
    let sliderClassicPage = /* @__PURE__ */ state(0);
    let sliderClassicTotalPages = /* @__PURE__ */ user_derived(() => Math.ceil(get(filteredUpsellData).length / SLIDER_CLASSIC_PAGE_SIZE));
    let sliderClassicPageProducts = /* @__PURE__ */ user_derived(() => get(filteredUpsellData).slice(get(sliderClassicPage) * SLIDER_CLASSIC_PAGE_SIZE, (get(sliderClassicPage) + 1) * SLIDER_CLASSIC_PAGE_SIZE));
    user_effect(() => {
      if (get(sliderClassicPage) >= get(sliderClassicTotalPages) && get(sliderClassicTotalPages) > 0) {
        set(sliderClassicPage, 0);
      }
    });
    function nextSliderClassicPage() {
      set(sliderClassicPage, (get(sliderClassicPage) + 1) % get(sliderClassicTotalPages));
    }
    function prevSliderClassicPage() {
      set(sliderClassicPage, (get(sliderClassicPage) - 1 + get(sliderClassicTotalPages)) % get(sliderClassicTotalPages));
    }
    let toggleShownCount = /* @__PURE__ */ state(0);
    async function handleToggleUpsellAddToCart(upsellProduct) {
      await $$props.handleUpsellAddToCart(upsellProduct);
      update(toggleShownCount);
      if (get(toggleShownCount) < get(filteredUpsellData).length) {
        $$props.nextUpsell();
      }
    }
    let toggleAllShown = /* @__PURE__ */ user_derived(() => get(toggleShownCount) >= get(filteredUpsellData).length);
    const iconsSvg = {
      cart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>',
      clock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12l-2 3" /><path d="M12 7v5" /></svg>',
      eye: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>',
      star: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" /></svg>',
      tag: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3" /></svg>',
      thunder: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z"></path></svg>',
      handHeart: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M230.33,141.06a24.34,24.34,0,0,0-18.61-4.77C230.5,117.33,240,98.48,240,80c0-26.47-21.29-48-47.46-48A47.58,47.58,0,0,0,156,48.75,47.58,47.58,0,0,0,119.46,32C93.29,32,72,53.53,72,80c0,11,3.24,21.69,10.06,33a31.87,31.87,0,0,0-14.75,8.4L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM119.46,48A31.15,31.15,0,0,1,148.6,67a8,8,0,0,0,14.8,0,31.15,31.15,0,0,1,29.14-19C209.59,48,224,62.65,224,80c0,19.51-15.79,41.58-45.66,63.9l-11.09,2.55A28,28,0,0,0,140,112H100.68C92.05,100.36,88,90.12,88,80,88,62.65,102.41,48,119.46,48ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9Z"></path></svg>',
      sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 7a9.3 9.3 0 0 0 1.516 -.546c.911 -.438 1.494 -1.015 1.937 -1.932c.207 -.428 .382 -.928 .547 -1.522c.165 .595 .34 1.095 .547 1.521c.443 .918 1.026 1.495 1.937 1.933c.426 .205 .925 .38 1.516 .546a9.3 9.3 0 0 0 -1.516 .547c-.911 .438 -1.494 1.015 -1.937 1.932a9 9 0 0 0 -.547 1.521c-.165 -.594 -.34 -1.095 -.547 -1.521c-.443 -.918 -1.026 -1.494 -1.937 -1.932a9 9 0 0 0 -1.516 -.547" /><path d="M3 14a21 21 0 0 0 1.652 -.532c2.542 -.953 3.853 -2.238 4.816 -4.806a20 20 0 0 0 .532 -1.662a20 20 0 0 0 .532 1.662c.963 2.567 2.275 3.853 4.816 4.806q .75 .28 1.652 .532a21 21 0 0 0 -1.652 .532c-2.542 .953 -3.854 2.238 -4.816 4.806a20 20 0 0 0 -.532 1.662a20 20 0 0 0 -.532 -1.662c-.963 -2.568 -2.275 -3.853 -4.816 -4.806a21 21 0 0 0 -1.652 -.532" /></svg>',
      plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>',
      ring: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /><path d="M21 6.727a11.05 11.05 0 0 0 -2.794 -3.727" /><path d="M3 6.727a11.05 11.05 0 0 1 2.792 -3.727" /></svg>',
      thumb: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" /></svg>',
      flame: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235" /></svg>',
      gift: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2" /><path d="M12 8l0 13" /><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" /></svg>',
      heart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>'
    };
    var div = root$9();
    var node_1 = child(div);
    {
      var consequent_3 = ($$anchor2) => {
        var div_1 = root_1$6();
        var div_2 = child(div_1);
        var node_2 = child(div_2);
        {
          var consequent_1 = ($$anchor3) => {
            var div_3 = root_2$4();
            each(div_3, 21, () => Object.entries(listUpsellIcons()), index, ($$anchor4, $$item) => {
              var $$array = /* @__PURE__ */ user_derived(() => to_array(get($$item), 2));
              let key2 = () => get($$array)[0];
              let enabled = () => get($$array)[1];
              var fragment = comment();
              var node_3 = first_child(fragment);
              {
                var consequent = ($$anchor5) => {
                  var span = root_4$1();
                  var node_4 = child(span);
                  html(node_4, () => iconsSvg[key2()]);
                  append($$anchor5, span);
                };
                if_block(node_3, ($$render) => {
                  if (enabled() && iconsSvg[key2()]) $$render(consequent);
                });
              }
              append($$anchor4, fragment);
            });
            append($$anchor3, div_3);
          };
          if_block(node_2, ($$render) => {
            if ($$props.cartDrawerProps?.upsellCart?.showIconsBeforeTitle && Object.entries(listUpsellIcons()).some(([, en]) => en)) $$render(consequent_1);
          });
        }
        var div_4 = sibling(node_2, 2);
        var node_5 = child(div_4);
        html(node_5, () => getTranslated("upsell.textUpsell") || $$props.cartDrawerProps?.upsellCart?.textUpsell || "");
        var node_6 = sibling(div_2, 2);
        {
          var consequent_2 = ($$anchor3) => {
            {
              let $0 = /* @__PURE__ */ user_derived(() => get(layout) === "vertical" || get(layout) === "sliderPlus" ? prevVerticalPage : get(layout) === "sliderClassic" ? prevSliderClassicPage : $$props.previousUpsell);
              let $1 = /* @__PURE__ */ user_derived(() => get(layout) === "vertical" || get(layout) === "sliderPlus" ? nextVerticalPage : get(layout) === "sliderClassic" ? nextSliderClassicPage : $$props.nextUpsell);
              let $2 = /* @__PURE__ */ user_derived(() => get(layout) === "vertical" || get(layout) === "sliderPlus" ? get(verticalPage) : get(layout) === "sliderClassic" ? get(sliderClassicPage) : get(safeCurrentIndex));
              let $3 = /* @__PURE__ */ user_derived(() => get(layout) === "vertical" || get(layout) === "sliderPlus" ? get(verticalTotalPages) : get(layout) === "sliderClassic" ? get(sliderClassicTotalPages) : get(filteredUpsellData).length);
              let $4 = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.upsellCart?.showProductCounter ?? false);
              let $5 = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.stylesCart?.["--moonbundle-cartdrawer-upsell-textColor"] ?? "#111827");
              UpsellNavigation($$anchor3, {
                get previousUpsell() {
                  return get($0);
                },
                get nextUpsell() {
                  return get($1);
                },
                get currentIndex() {
                  return get($2);
                },
                get totalProducts() {
                  return get($3);
                },
                get showCounter() {
                  return get($4);
                },
                get textColor() {
                  return get($5);
                }
              });
            }
          };
          if_block(node_6, ($$render) => {
            if (get(showNavigation)) $$render(consequent_2);
          });
        }
        append($$anchor2, div_1);
      };
      if_block(node_1, ($$render) => {
        if ($$props.cartDrawerProps?.upsellCart?.textUpsell && get(filteredUpsellData).length > 0 && !(get(layout) === "toggle" && get(toggleAllShown))) $$render(consequent_3);
      });
    }
    var div_5 = sibling(node_1, 2);
    div_5.__touchstart = function(...$$args) {
      $$props.handleTouchStart?.apply(this, $$args);
    };
    div_5.__touchmove = function(...$$args) {
      $$props.handleTouchMove?.apply(this, $$args);
    };
    div_5.__touchend = function(...$$args) {
      $$props.handleTouchEnd?.apply(this, $$args);
    };
    var node_7 = child(div_5);
    {
      var consequent_4 = ($$anchor2) => {
        var div_6 = root_6$1();
        append($$anchor2, div_6);
      };
      var alternate_4 = ($$anchor2) => {
        var fragment_2 = comment();
        var node_8 = first_child(fragment_2);
        {
          var consequent_11 = ($$anchor3) => {
            var fragment_3 = comment();
            var node_9 = first_child(fragment_3);
            {
              var consequent_5 = ($$anchor4) => {
                var div_7 = root_9();
                each(
                  div_7,
                  21,
                  () => get(showNavigation) ? get(verticalPageProducts) : get(filteredUpsellData),
                  index,
                  ($$anchor5, product, i) => {
                    {
                      let $0 = /* @__PURE__ */ user_derived(() => get(showNavigation) ? get(verticalPage) * VERTICAL_PAGE_SIZE + i : i);
                      UpsellProduct($$anchor5, {
                        get upsellProduct() {
                          return get(product);
                        },
                        get index() {
                          return get($0);
                        },
                        isCurrent: true,
                        get layout() {
                          return get(layout);
                        },
                        get cartDrawerProps() {
                          return $$props.cartDrawerProps;
                        },
                        get cartDisabled() {
                          return $$props.cartDisabled;
                        },
                        get loadingUpsell() {
                          return $$props.loadingUpsell;
                        },
                        get shopifyFormatCurrency() {
                          return $$props.shopifyFormatCurrency;
                        },
                        get getUpsellOriginalPrice() {
                          return $$props.getUpsellOriginalPrice;
                        },
                        get getUpsellFinalPrice() {
                          return $$props.getUpsellFinalPrice;
                        },
                        get getUpsellDiscountAmount() {
                          return $$props.getUpsellDiscountAmount;
                        },
                        get formatDiscountDisplay() {
                          return $$props.formatDiscountDisplay;
                        },
                        get getUpsellImageSource() {
                          return $$props.getUpsellImageSource;
                        },
                        get getUpsellSubtitle() {
                          return $$props.getUpsellSubtitle;
                        },
                        get generateOptionCombinations() {
                          return $$props.generateOptionCombinations;
                        },
                        get getDefaultCombination() {
                          return $$props.getDefaultCombination;
                        },
                        get handleUpsellAddToCart() {
                          return $$props.handleUpsellAddToCart;
                        },
                        handleUpsellVariantChange: onUpsellVariantChange
                      });
                    }
                  }
                );
                append($$anchor4, div_7);
              };
              var alternate_3 = ($$anchor4) => {
                var fragment_5 = comment();
                var node_10 = first_child(fragment_5);
                {
                  var consequent_6 = ($$anchor5) => {
                    var div_8 = root_12();
                    each(
                      div_8,
                      21,
                      () => get(showNavigation) ? get(verticalPageProducts) : get(filteredUpsellData),
                      index,
                      ($$anchor6, product, i) => {
                        {
                          let $0 = /* @__PURE__ */ user_derived(() => get(showNavigation) ? get(verticalPage) * VERTICAL_PAGE_SIZE + i : i);
                          UpsellProduct($$anchor6, {
                            get upsellProduct() {
                              return get(product);
                            },
                            get index() {
                              return get($0);
                            },
                            isCurrent: true,
                            get layout() {
                              return get(layout);
                            },
                            get cartDrawerProps() {
                              return $$props.cartDrawerProps;
                            },
                            get cartDisabled() {
                              return $$props.cartDisabled;
                            },
                            get loadingUpsell() {
                              return $$props.loadingUpsell;
                            },
                            get shopifyFormatCurrency() {
                              return $$props.shopifyFormatCurrency;
                            },
                            get getUpsellOriginalPrice() {
                              return $$props.getUpsellOriginalPrice;
                            },
                            get getUpsellFinalPrice() {
                              return $$props.getUpsellFinalPrice;
                            },
                            get getUpsellDiscountAmount() {
                              return $$props.getUpsellDiscountAmount;
                            },
                            get formatDiscountDisplay() {
                              return $$props.formatDiscountDisplay;
                            },
                            get getUpsellImageSource() {
                              return $$props.getUpsellImageSource;
                            },
                            get getUpsellSubtitle() {
                              return $$props.getUpsellSubtitle;
                            },
                            get generateOptionCombinations() {
                              return $$props.generateOptionCombinations;
                            },
                            get getDefaultCombination() {
                              return $$props.getDefaultCombination;
                            },
                            get handleUpsellAddToCart() {
                              return $$props.handleUpsellAddToCart;
                            },
                            handleUpsellVariantChange: onUpsellVariantChange
                          });
                        }
                      }
                    );
                    append($$anchor5, div_8);
                  };
                  var alternate_2 = ($$anchor5) => {
                    var fragment_7 = comment();
                    var node_11 = first_child(fragment_7);
                    {
                      var consequent_7 = ($$anchor6) => {
                        var div_9 = root_15$1();
                        each(div_9, 21, () => get(sliderClassicPageProducts), index, ($$anchor7, product, i) => {
                          {
                            let $0 = /* @__PURE__ */ user_derived(() => get(sliderClassicPage) * SLIDER_CLASSIC_PAGE_SIZE + i);
                            UpsellProduct($$anchor7, {
                              get upsellProduct() {
                                return get(product);
                              },
                              get index() {
                                return get($0);
                              },
                              isCurrent: true,
                              get layout() {
                                return get(layout);
                              },
                              get cartDrawerProps() {
                                return $$props.cartDrawerProps;
                              },
                              get cartDisabled() {
                                return $$props.cartDisabled;
                              },
                              get loadingUpsell() {
                                return $$props.loadingUpsell;
                              },
                              get shopifyFormatCurrency() {
                                return $$props.shopifyFormatCurrency;
                              },
                              get getUpsellOriginalPrice() {
                                return $$props.getUpsellOriginalPrice;
                              },
                              get getUpsellFinalPrice() {
                                return $$props.getUpsellFinalPrice;
                              },
                              get getUpsellDiscountAmount() {
                                return $$props.getUpsellDiscountAmount;
                              },
                              get formatDiscountDisplay() {
                                return $$props.formatDiscountDisplay;
                              },
                              get getUpsellImageSource() {
                                return $$props.getUpsellImageSource;
                              },
                              get getUpsellSubtitle() {
                                return $$props.getUpsellSubtitle;
                              },
                              get generateOptionCombinations() {
                                return $$props.generateOptionCombinations;
                              },
                              get getDefaultCombination() {
                                return $$props.getDefaultCombination;
                              },
                              get handleUpsellAddToCart() {
                                return $$props.handleUpsellAddToCart;
                              },
                              handleUpsellVariantChange: onUpsellVariantChange
                            });
                          }
                        });
                        append($$anchor6, div_9);
                      };
                      var alternate_1 = ($$anchor6) => {
                        var fragment_9 = comment();
                        var node_12 = first_child(fragment_9);
                        {
                          var consequent_9 = ($$anchor7) => {
                            var fragment_10 = comment();
                            var node_13 = first_child(fragment_10);
                            {
                              var consequent_8 = ($$anchor8) => {
                                var div_10 = root_19$1();
                                const upsellProduct = /* @__PURE__ */ user_derived(() => get(filteredUpsellData)[get(safeCurrentIndex)]);
                                const index2 = /* @__PURE__ */ user_derived(() => get(safeCurrentIndex));
                                var node_14 = child(div_10);
                                key(node_14, () => get(safeCurrentIndex), ($$anchor9) => {
                                  UpsellProduct($$anchor9, {
                                    get upsellProduct() {
                                      return get(upsellProduct);
                                    },
                                    get index() {
                                      return get(index2);
                                    },
                                    isCurrent: true,
                                    get layout() {
                                      return get(layout);
                                    },
                                    get cartDrawerProps() {
                                      return $$props.cartDrawerProps;
                                    },
                                    get cartDisabled() {
                                      return $$props.cartDisabled;
                                    },
                                    get loadingUpsell() {
                                      return $$props.loadingUpsell;
                                    },
                                    get shopifyFormatCurrency() {
                                      return $$props.shopifyFormatCurrency;
                                    },
                                    get getUpsellOriginalPrice() {
                                      return $$props.getUpsellOriginalPrice;
                                    },
                                    get getUpsellFinalPrice() {
                                      return $$props.getUpsellFinalPrice;
                                    },
                                    get getUpsellDiscountAmount() {
                                      return $$props.getUpsellDiscountAmount;
                                    },
                                    get formatDiscountDisplay() {
                                      return $$props.formatDiscountDisplay;
                                    },
                                    get getUpsellImageSource() {
                                      return $$props.getUpsellImageSource;
                                    },
                                    get getUpsellSubtitle() {
                                      return $$props.getUpsellSubtitle;
                                    },
                                    get generateOptionCombinations() {
                                      return $$props.generateOptionCombinations;
                                    },
                                    get getDefaultCombination() {
                                      return $$props.getDefaultCombination;
                                    },
                                    handleUpsellAddToCart: handleToggleUpsellAddToCart,
                                    handleUpsellVariantChange: onUpsellVariantChange
                                  });
                                });
                                append($$anchor8, div_10);
                              };
                              if_block(node_13, ($$render) => {
                                if (!get(toggleAllShown)) $$render(consequent_8);
                              });
                            }
                            append($$anchor7, fragment_10);
                          };
                          var alternate = ($$anchor7) => {
                            var div_11 = root_21();
                            const upsellProduct = /* @__PURE__ */ user_derived(() => get(filteredUpsellData)[get(safeCurrentIndex)]);
                            const index2 = /* @__PURE__ */ user_derived(() => get(safeCurrentIndex));
                            const nextIndex = /* @__PURE__ */ user_derived(() => (get(safeCurrentIndex) + 1) % get(filteredUpsellData).length);
                            const hasNext = /* @__PURE__ */ user_derived(() => get(showNavigation) && get(nextIndex) !== get(safeCurrentIndex));
                            const nextProduct = /* @__PURE__ */ user_derived(() => get(hasNext) ? get(filteredUpsellData)[get(nextIndex)] : null);
                            var node_15 = child(div_11);
                            UpsellProduct(node_15, {
                              get upsellProduct() {
                                return get(upsellProduct);
                              },
                              get index() {
                                return get(index2);
                              },
                              isCurrent: true,
                              get layout() {
                                return get(layout);
                              },
                              get cartDrawerProps() {
                                return $$props.cartDrawerProps;
                              },
                              get cartDisabled() {
                                return $$props.cartDisabled;
                              },
                              get loadingUpsell() {
                                return $$props.loadingUpsell;
                              },
                              get shopifyFormatCurrency() {
                                return $$props.shopifyFormatCurrency;
                              },
                              get getUpsellOriginalPrice() {
                                return $$props.getUpsellOriginalPrice;
                              },
                              get getUpsellFinalPrice() {
                                return $$props.getUpsellFinalPrice;
                              },
                              get getUpsellDiscountAmount() {
                                return $$props.getUpsellDiscountAmount;
                              },
                              get formatDiscountDisplay() {
                                return $$props.formatDiscountDisplay;
                              },
                              get getUpsellImageSource() {
                                return $$props.getUpsellImageSource;
                              },
                              get getUpsellSubtitle() {
                                return $$props.getUpsellSubtitle;
                              },
                              get generateOptionCombinations() {
                                return $$props.generateOptionCombinations;
                              },
                              get getDefaultCombination() {
                                return $$props.getDefaultCombination;
                              },
                              get handleUpsellAddToCart() {
                                return $$props.handleUpsellAddToCart;
                              },
                              handleUpsellVariantChange: onUpsellVariantChange
                            });
                            var node_16 = sibling(node_15, 2);
                            {
                              var consequent_10 = ($$anchor8) => {
                                UpsellProduct($$anchor8, {
                                  get upsellProduct() {
                                    return get(nextProduct);
                                  },
                                  get index() {
                                    return get(nextIndex);
                                  },
                                  isCurrent: false,
                                  get layout() {
                                    return get(layout);
                                  },
                                  get cartDrawerProps() {
                                    return $$props.cartDrawerProps;
                                  },
                                  get cartDisabled() {
                                    return $$props.cartDisabled;
                                  },
                                  get loadingUpsell() {
                                    return $$props.loadingUpsell;
                                  },
                                  get shopifyFormatCurrency() {
                                    return $$props.shopifyFormatCurrency;
                                  },
                                  get getUpsellOriginalPrice() {
                                    return $$props.getUpsellOriginalPrice;
                                  },
                                  get getUpsellFinalPrice() {
                                    return $$props.getUpsellFinalPrice;
                                  },
                                  get getUpsellDiscountAmount() {
                                    return $$props.getUpsellDiscountAmount;
                                  },
                                  get formatDiscountDisplay() {
                                    return $$props.formatDiscountDisplay;
                                  },
                                  get getUpsellImageSource() {
                                    return $$props.getUpsellImageSource;
                                  },
                                  get getUpsellSubtitle() {
                                    return $$props.getUpsellSubtitle;
                                  },
                                  get generateOptionCombinations() {
                                    return $$props.generateOptionCombinations;
                                  },
                                  get getDefaultCombination() {
                                    return $$props.getDefaultCombination;
                                  },
                                  get handleUpsellAddToCart() {
                                    return $$props.handleUpsellAddToCart;
                                  },
                                  handleUpsellVariantChange: onUpsellVariantChange
                                });
                              };
                              if_block(node_16, ($$render) => {
                                if (get(hasNext) && get(nextProduct)) $$render(consequent_10);
                              });
                            }
                            append($$anchor7, div_11);
                          };
                          if_block(
                            node_12,
                            ($$render) => {
                              if (get(layout) === "toggle") $$render(consequent_9);
                              else $$render(alternate, false);
                            },
                            true
                          );
                        }
                        append($$anchor6, fragment_9);
                      };
                      if_block(
                        node_11,
                        ($$render) => {
                          if (get(layout) === "sliderClassic") $$render(consequent_7);
                          else $$render(alternate_1, false);
                        },
                        true
                      );
                    }
                    append($$anchor5, fragment_7);
                  };
                  if_block(
                    node_10,
                    ($$render) => {
                      if (get(layout) === "sliderPlus") $$render(consequent_6);
                      else $$render(alternate_2, false);
                    },
                    true
                  );
                }
                append($$anchor4, fragment_5);
              };
              if_block(node_9, ($$render) => {
                if (get(layout) === "vertical") $$render(consequent_5);
                else $$render(alternate_3, false);
              });
            }
            append($$anchor3, fragment_3);
          };
          if_block(
            node_8,
            ($$render) => {
              if (get(filteredUpsellData).length > 0) $$render(consequent_11);
            },
            true
          );
        }
        append($$anchor2, fragment_2);
      };
      if_block(node_7, ($$render) => {
        if (get(isLoadingRecommendations)) $$render(consequent_4);
        else $$render(alternate_4, false);
      });
    }
    append($$anchor, div);
    pop();
  }
  delegate(["touchstart", "touchmove", "touchend"]);
  var root$8 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-empty"><svg class="moonbundle-cart-empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13H17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> <div class="moonbundle-cart-empty-text"><!></div></div>`);
  function EmptyCart($$anchor, $$props) {
    push($$props, true);
    let emptyCartText = prop($$props, "emptyCartText", 3, "");
    var div = root$8();
    var div_1 = sibling(child(div), 2);
    var node = child(div_1);
    html(node, () => getTranslated("empty.textEmptyCart") || emptyCartText());
    append($$anchor, div);
    pop();
  }
  function toggle(_, isExpanded) {
    set(isExpanded, !get(isExpanded));
  }
  var root_2$3 = /* @__PURE__ */ from_html(`<button class="moonbundle-cart-accelerated-checkout-label" type="button"><span class="moonbundle-cart-accelerated-checkout-text"> </span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></button>`);
  var root_3$4 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-accelerated-checkout-buttons"><!></div>`);
  var root_1$5 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-accelerated-checkout"><!> <!></div>`);
  var root_6 = /* @__PURE__ */ from_html(`<button class="moonbundle-cart-accelerated-checkout-label" type="button"><span class="moonbundle-cart-accelerated-checkout-text"> </span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></button>`);
  var root_7$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-accelerated-checkout-buttons"><button class="moonbundle-cart-accelerated-checkout-btn-preview" type="button" disabled>Accelerated checkout buttons</button></div>`);
  var root_5$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-accelerated-checkout"><!> <!></div>`);
  function AcceleratedCheckout($$anchor, $$props) {
    push($$props, true);
    let isExpanded = /* @__PURE__ */ state(proxy($$props.isTextExpressCheckoutOpen));
    user_effect(() => {
      set(isExpanded, $$props.isTextExpressCheckoutOpen, true);
    });
    let prevItemCount = 0;
    user_effect(() => {
      if (prevItemCount === 0 && $$props.itemCount > 0 && $$props.acceleratedCheckoutHtml) {
        fetch("/cart/update.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        }).catch(() => {
        });
      }
      prevItemCount = $$props.itemCount;
    });
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent_2 = ($$anchor2) => {
        var div = root_1$5();
        var node_1 = child(div);
        {
          var consequent = ($$anchor3) => {
            var button = root_2$3();
            button.__click = [toggle, isExpanded];
            var span = child(button);
            var text_1 = child(span);
            var svg = sibling(span, 2);
            let classes;
            template_effect(
              ($0, $1) => {
                set_text(text_1, $0);
                classes = set_class(svg, 0, "moonbundle-cart-accelerated-checkout-arrow", null, classes, $1);
              },
              [
                () => getTranslated("footer.acceleratedCheckoutText") || $$props.text,
                () => ({
                  "moonbundle-cart-accelerated-checkout-arrow--expanded": get(isExpanded)
                })
              ]
            );
            append($$anchor3, button);
          };
          if_block(node_1, ($$render) => {
            if ($$props.isTextExpressCheckout) $$render(consequent);
          });
        }
        var node_2 = sibling(node_1, 2);
        {
          var consequent_1 = ($$anchor3) => {
            var div_1 = root_3$4();
            var node_3 = child(div_1);
            html(node_3, () => $$props.acceleratedCheckoutHtml);
            append($$anchor3, div_1);
          };
          if_block(node_2, ($$render) => {
            if (!$$props.isTextExpressCheckout || get(isExpanded)) $$render(consequent_1);
          });
        }
        append($$anchor2, div);
      };
      var alternate = ($$anchor2) => {
        var fragment_1 = comment();
        var node_4 = first_child(fragment_1);
        {
          var consequent_5 = ($$anchor3) => {
            var div_2 = root_5$1();
            var node_5 = child(div_2);
            {
              var consequent_3 = ($$anchor4) => {
                var button_1 = root_6();
                button_1.__click = [toggle, isExpanded];
                var span_1 = child(button_1);
                var text_2 = child(span_1);
                var svg_1 = sibling(span_1, 2);
                let classes_1;
                template_effect(
                  ($0, $1) => {
                    set_text(text_2, $0);
                    classes_1 = set_class(svg_1, 0, "moonbundle-cart-accelerated-checkout-arrow", null, classes_1, $1);
                  },
                  [
                    () => getTranslated("footer.acceleratedCheckoutText") || $$props.text,
                    () => ({
                      "moonbundle-cart-accelerated-checkout-arrow--expanded": get(isExpanded)
                    })
                  ]
                );
                append($$anchor4, button_1);
              };
              if_block(node_5, ($$render) => {
                if ($$props.isTextExpressCheckout) $$render(consequent_3);
              });
            }
            var node_6 = sibling(node_5, 2);
            {
              var consequent_4 = ($$anchor4) => {
                var div_3 = root_7$1();
                append($$anchor4, div_3);
              };
              if_block(node_6, ($$render) => {
                if (!$$props.isTextExpressCheckout || get(isExpanded)) $$render(consequent_4);
              });
            }
            append($$anchor3, div_2);
          };
          if_block(
            node_4,
            ($$render) => {
              if ($$props.isActive && $$props.isPreview) $$render(consequent_5);
            },
            true
          );
        }
        append($$anchor2, fragment_1);
      };
      if_block(node, ($$render) => {
        if ($$props.isActive && !$$props.isPreview && $$props.acceleratedCheckoutHtml && $$props.itemCount > 0) $$render(consequent_2);
        else $$render(alternate, false);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  var root_1$4 = /* @__PURE__ */ from_html(`<span class="moonbundle-cart-subtotal-discount-bubble"><!></span>`);
  var root_3$3 = /* @__PURE__ */ from_html(`<span class="moonbundle-cart-subtotal-originalPrice"><!></span>`);
  var root$7 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-drawer-subtotal"><div class="moonbundle-cart-drawer-subtotal-left"><span><!></span></div> <div class="moonbundle-cart-drawer-subtotal-price-container"><!> <span id="moonbundle-cart-subtotal" class="moonbundle-cart-subtotal-finalPrice"><!></span></div></div>`);
  function CartSubtotal($$anchor, $$props) {
    push($$props, true);
    let discountAmount = /* @__PURE__ */ user_derived(() => {
      const originalPrice = $$props.totalOriginalPriceIfCompareAtPrice ? $$props.totalOriginalPriceIfCompareAtPrice : $$props.originalTotalPrice;
      return originalPrice > $$props.total ? originalPrice - $$props.total : 0;
    });
    var div = root$7();
    var div_1 = child(div);
    var span = child(div_1);
    var node = child(span);
    html(node, () => getTranslated("footer.subtotalText") || $$props.subtotalText);
    var div_2 = sibling(div_1, 2);
    var node_1 = child(div_2);
    {
      var consequent = ($$anchor2) => {
        var span_1 = root_1$4();
        const discountFormatted = /* @__PURE__ */ user_derived(() => $$props.shopifyFormatCurrency(get(discountAmount)));
        const textSaveProcessed = /* @__PURE__ */ user_derived(() => (() => {
          const text2 = getTranslated("subtotal.textSaveDiscountSubtotal") ?? $$props.textSaveDiscountSubtotal ?? "";
          if (!text2) {
            return get(discountFormatted);
          }
          return hasDynamicVariable(text2, "discount_amount") ? replaceDynamicVariable(text2, "discount_amount", get(discountFormatted)) : `${text2} ${get(discountFormatted)}`;
        })());
        var node_2 = child(span_1);
        html(node_2, () => get(textSaveProcessed));
        append($$anchor2, span_1);
      };
      var alternate = ($$anchor2) => {
        var fragment = comment();
        var node_3 = first_child(fragment);
        {
          var consequent_1 = ($$anchor3) => {
            var span_2 = root_3$3();
            var node_4 = child(span_2);
            html(node_4, () => $$props.shopifyFormatCurrency($$props.totalOriginalPriceIfCompareAtPrice ? $$props.totalOriginalPriceIfCompareAtPrice : $$props.originalTotalPrice));
            append($$anchor3, span_2);
          };
          if_block(
            node_3,
            ($$render) => {
              if ($$props.totalOriginalPriceIfCompareAtPrice && $$props.totalOriginalPriceIfCompareAtPrice > $$props.total || $$props.originalTotalPrice && $$props.originalTotalPrice > $$props.total) $$render(consequent_1);
            },
            true
          );
        }
        append($$anchor2, fragment);
      };
      if_block(node_1, ($$render) => {
        if ($$props.showDiscountBubble && get(discountAmount) > 0) $$render(consequent);
        else $$render(alternate, false);
      });
    }
    var span_3 = sibling(node_1, 2);
    var node_5 = child(span_3);
    html(node_5, () => $$props.shopifyFormatCurrency($$props.total));
    append($$anchor, div);
    pop();
  }
  var root_1$3 = /* @__PURE__ */ from_html(`<span class="moonbundle-checkout-icon moonbundle-checkout-icon--left"><!></span>`);
  var root_2$2 = /* @__PURE__ */ from_html(`<span class="moonbundle-checkout-icon moonbundle-checkout-icon--right"><!></span>`);
  var root_3$2 = /* @__PURE__ */ from_html(`<div class="moonbundle-loading-overlay__spinner"><svg aria-hidden="true" focusable="false" class="moonbundle-spinner-rotator" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="moonbundle-circle-loader" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle></svg></div>`);
  var root$6 = /* @__PURE__ */ from_html(`<button class="moonbundle-cart-drawer-checkout"><!> <!> <!> <!></button>`);
  function CheckoutButton($$anchor, $$props) {
    push($$props, true);
    const iconsSvg = {
      cart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>',
      check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>',
      clock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12l-2 3" /><path d="M12 7v5" /></svg>',
      cross: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>',
      crossCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M10 10l4 4m0 -4l-4 4" /></svg>',
      flame: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235" /></svg>',
      gift: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2" /><path d="M12 8l0 13" /><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" /></svg>',
      giftCard: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" /><path d="M3 10h18" /><path d="M7 15h.01" /><path d="M11 15h2" /></svg>',
      giftCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 9v6" /><path d="M8 12h8" /></svg>',
      handHeart: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M230.33,141.06a24.34,24.34,0,0,0-18.61-4.77C230.5,117.33,240,98.48,240,80c0-26.47-21.29-48-47.46-48A47.58,47.58,0,0,0,156,48.75,47.58,47.58,0,0,0,119.46,32C93.29,32,72,53.53,72,80c0,11,3.24,21.69,10.06,33a31.87,31.87,0,0,0-14.75,8.4L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56Z"></path></svg>',
      heart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>',
      plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>',
      ring: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /></svg>',
      shipping: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M2 5l6 -1l0 14l-6 1z" /><path d="M8 4l8 -2l0 14l-8 2z" /><path d="M16 2l4 1l0 14l-4 1z" /><path d="M8 10l8 -2" /></svg>',
      sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 7a9.3 9.3 0 0 0 1.516 -.546c.911 -.438 1.494 -1.015 1.937 -1.932c.207 -.428 .382 -.928 .547 -1.522c.165 .595 .34 1.095 .547 1.521c.443 .918 1.026 1.495 1.937 1.933c.426 .205 .925 .38 1.516 .546a9.3 9.3 0 0 0 -1.516 .547c-.911 .438 -1.494 1.015 -1.937 1.932a9 9 0 0 0 -.547 1.521c-.165 -.594 -.34 -1.095 -.547 -1.521c-.443 -.918 -1.026 -1.494 -1.937 -1.932a9 9 0 0 0 -1.516 -.547" /><path d="M3 14a21 21 0 0 0 1.652 -.532c2.542 -.953 3.853 -2.238 4.816 -4.806a20 20 0 0 0 .532 -1.662a20 20 0 0 0 .532 1.662c.963 2.567 2.275 3.853 4.816 4.806q .75 .28 1.652 .532a21 21 0 0 0 -1.652 .532c-2.542 .953 -3.854 2.238 -4.816 4.806a20 20 0 0 0 -.532 1.662a20 20 0 0 0 -.532 -1.662c-.963 -2.568 -2.275 -3.853 -4.816 -4.806a21 21 0 0 0 -1.652 -.532" /></svg>',
      star: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" /></svg>',
      tag: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3" /></svg>',
      thumb: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" /></svg>',
      thunder: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17Z"></path></svg>',
      lock: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 13.05a1.5 1.5 0 1 0-1.5 0v.45a.75.75 0 0 0 1.5 0v-.45Z"></path><path fill-rule="evenodd" d="M6.25 7.095v-.345a3.75 3.75 0 1 1 7.5 0v.345a3.001 3.001 0 0 1 2.25 2.905v4a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3v-4a3 3 0 0 1 2.25-2.905Zm1.5-.345a2.25 2.25 0 0 1 4.5 0v.25h-4.5v-.25Zm-2.25 3.25a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5v-4Z"></path></svg>',
      lockFill: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.25 6.75v.345a3.001 3.001 0 0 0-2.25 2.905v4a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-4a3.001 3.001 0 0 0-2.25-2.905v-.345a3.75 3.75 0 1 0-7.5 0Zm3.75-2.25a2.25 2.25 0 0 0-2.25 2.25v.25h4.5v-.25a2.25 2.25 0 0 0-2.25-2.25Zm1.5 7.25a1.5 1.5 0 0 1-.75 1.3v.45a.75.75 0 0 1-1.5 0v-.45a1.5 1.5 0 1 1 2.25-1.3Z"></path></svg>',
      handPay: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.621 4h5.258c.395 0 .736 0 1.017.023.297.024.592.078.875.222.424.216.768.56.984.984.144.283.198.578.222.875.023.28.023.622.023 1.017v2.258c0 .395 0 .736-.023 1.017a2.29 2.29 0 0 1-.222.875 2.25 2.25 0 0 1-.983.984c-.284.144-.58.198-.876.222-.28.023-.622.023-1.017.023h-2.58c-.08.083-.169.16-.265.23l-2.73 1.965c-.565.407-.93.67-1.335.859-.358.167-.736.29-1.125.363-.44.083-.889.083-1.586.083h-1.508a.75.75 0 0 1 0-1.5h1.436c.794 0 1.095-.003 1.379-.057.266-.05.524-.134.77-.248.261-.122.508-.296 1.152-.76l2.67-1.923a.423.423 0 0 0-.35-.753l-4.875 1.219a.75.75 0 0 1-.364-1.456l.932-.233v-2.289c-.59.002-.821.011-1.033.062a2.25 2.25 0 0 0-.65.27c-.21.128-.398.31-.943.854l-.594.594a.75.75 0 0 1-1.06-1.06l.654-.655c.46-.46.78-.78 1.16-1.012a3.75 3.75 0 0 1 1.083-.45c.397-.095.813-.103 1.387-.103a6.79 6.79 0 0 1 .019-.396 2.29 2.29 0 0 1 .222-.875 2.25 2.25 0 0 1 .984-.984 2.29 2.29 0 0 1 .875-.222c.28-.023.622-.023 1.017-.023Zm5.229 7h-2.024a1.925 1.925 0 0 0-2.382-1.697l-2.444.611v-1.414h8.5v.85c0 .432 0 .712-.018.924-.017.204-.045.28-.064.317a.75.75 0 0 1-.328.327c-.037.02-.112.047-.316.064-.212.017-.492.018-.924.018Zm1.645-4.5h-8.49c.002-.104.006-.194.013-.274.017-.204.045-.28.064-.316a.75.75 0 0 1 .328-.328c.037-.02.112-.047.316-.064.212-.017.492-.018.924-.018h5.2c.432 0 .712 0 .924.018.204.017.28.045.316.064a.75.75 0 0 1 .328.328c.02.037.047.112.064.316.007.08.01.17.013.274Z"></path></svg>',
      clipboard: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.515 4.75a2 2 0 0 1 1.985-1.75h3a2 2 0 0 1 1.985 1.75h.265a2.25 2.25 0 0 1 2.25 2.25v7.75a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-7.75a2.25 2.25 0 0 1 2.25-2.25h.265Zm1.985-.25h3a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Zm-1.987 1.73.002.02h-.265a.75.75 0 0 0-.75.75v7.75c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75v-7.75a.75.75 0 0 0-.75-.75h-.265a2 2 0 0 1-1.985 1.75h-3a2 2 0 0 1-1.987-1.77Z"></path></svg>',
      wallet: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.5 6.75a2.75 2.75 0 0 1 2.75-2.75h9.5a2.75 2.75 0 0 1 2.75 2.75v1.25a.75.75 0 0 1-1.5 0v-1.25c0-.69-.56-1.25-1.25-1.25h-9.5c-.69 0-1.25.56-1.25 1.25v.5h8a1 1 0 1 1 0 2h-8v4c0 .69.56 1.25 1.25 1.25h4.052a.75.75 0 0 1 0 1.5h-4.052a2.75 2.75 0 0 1-2.75-2.75v-6.5Z"></path><path d="M5.75 11.5a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5h-2Z"></path><path fill-rule="evenodd" d="M13 12.25a1 1 0 0 0-1 1v2.75a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2.75a1 1 0 0 0-1-1v-.75a2 2 0 1 0-4 0v.75Zm2.5 0v-.75a.5.5 0 0 0-1 0v.75h1Z"></path></svg>',
      shieldCheck: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M8.28 8.683a.75.75 0 0 0-1.06 1.06l1.548 1.548a.75.75 0 0 0 1.06 0l2.963-2.962a.75.75 0 0 0-1.06-1.06l-2.433 2.431-1.018-1.017Z"></path><path fill-rule="evenodd" d="M11.093 2.914a1.75 1.75 0 0 0-2.186 0l-.317.253a15.25 15.25 0 0 1-3.217 1.976l-.847.384a1.71 1.71 0 0 0-1.01 1.628c.28 6.25 4.38 9.048 5.732 9.802.47.262 1.034.262 1.503 0 1.352-.753 5.454-3.55 5.734-9.783a1.71 1.71 0 0 0-1.002-1.623l-.9-.416a15.249 15.249 0 0 1-3.136-1.938l-.354-.283Zm-1.25 1.171a.25.25 0 0 1 .313 0l.354.283a16.749 16.749 0 0 0 3.445 2.129l.9.415a.213.213 0 0 1 .131.195c-.246 5.489-3.827 7.906-4.965 8.54a.042.042 0 0 1-.02.006c-.005 0-.012 0-.022-.006-1.136-.634-4.718-3.053-4.965-8.56-.003-.066.037-.15.133-.194l.846-.385a16.75 16.75 0 0 0 3.534-2.17l.317-.253Z"></path></svg>',
      padlock: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 4.25a3.25 3.25 0 0 0-3.25 3.25.75.75 0 0 1-1.5 0 4.75 4.75 0 0 1 9.5 0 .75.75 0 0 1-1.5 0 3.25 3.25 0 0 0-3.25-3.25Zm-4 11.25v-4.25a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 .75.75v4.25h-8Zm-1.5-4.25v5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-5a2.25 2.25 0 0 0-2.25-2.25h-6.5a2.25 2.25 0 0 0-2.25 2.25Zm3.5 2a1 1 0 1 0 2 0v-.75a1 1 0 1 0-2 0v.75Zm1.25-5.75a.75.75 0 0 1 1.5 0 .75.75 0 0 0 1.5 0 2.25 2.25 0 0 0-4.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>'
    };
    const iconLeftEnabled = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.footerCart?.showCheckoutIconLeft ?? false);
    const iconRightEnabled = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.footerCart?.showCheckoutIconRight ?? false);
    const listLeft = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.footerCart?.checkoutIconsLeft ?? {});
    const listRight = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.footerCart?.checkoutIconsRight ?? {});
    const leftIconHtml = /* @__PURE__ */ user_derived(() => get(iconLeftEnabled) ? Object.entries(get(listLeft)).find(([, v]) => v)?.[0] ?? null : null);
    const rightIconHtml = /* @__PURE__ */ user_derived(() => get(iconRightEnabled) ? Object.entries(get(listRight)).find(([, v]) => v)?.[0] ?? null : null);
    var button = root$6();
    button.__click = function(...$$args) {
      $$props.handleCheckoutClick?.apply(this, $$args);
    };
    var node = child(button);
    {
      var consequent = ($$anchor2) => {
        var span = root_1$3();
        var node_1 = child(span);
        html(node_1, () => iconsSvg[get(leftIconHtml)]);
        append($$anchor2, span);
      };
      if_block(node, ($$render) => {
        if (get(leftIconHtml) && iconsSvg[get(leftIconHtml)]) $$render(consequent);
      });
    }
    var node_2 = sibling(node, 2);
    html(node_2, () => $$props.checkoutButtonText);
    var node_3 = sibling(node_2, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var span_1 = root_2$2();
        var node_4 = child(span_1);
        html(node_4, () => iconsSvg[get(rightIconHtml)]);
        append($$anchor2, span_1);
      };
      if_block(node_3, ($$render) => {
        if (get(rightIconHtml) && iconsSvg[get(rightIconHtml)]) $$render(consequent_1);
      });
    }
    var node_5 = sibling(node_3, 2);
    {
      var consequent_2 = ($$anchor2) => {
        var div = root_3$2();
        append($$anchor2, div);
      };
      if_block(node_5, ($$render) => {
        if ($$props.loadingCheckout) $$render(consequent_2);
      });
    }
    template_effect(() => button.disabled = $$props.itemCount < 1 || $$props.loadingCheckout);
    append($$anchor, button);
    pop();
  }
  delegate(["click"]);
  async function handleApplyDiscount(_, $$props, discountCode, isLoading, hasError) {
    if ($$props.isPreview === true) return;
    if (!get(discountCode).trim()) return;
    set(isLoading, true);
    set(hasError, false);
    try {
      const existingCodes = $$props.cartDiscountCodes.filter((d) => d.applicable).map((d) => d.code);
      const allCodes = [...existingCodes, get(discountCode).trim()].join(",");
      const response = await fetch("/cart/update.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount: allCodes })
      });
      if (!response.ok) throw new Error();
      const cart = await response.json();
      const applied = cart.discount_codes?.some((d) => d.code.toLowerCase() === get(discountCode).trim().toLowerCase() && d.applicable);
      if (applied) {
        set(discountCode, "");
        window.dispatchEvent(new CustomEvent("moonbundle-cart-updated"));
      } else {
        set(hasError, true);
      }
    } catch (e) {
      set(hasError, true);
    } finally {
      set(isLoading, false);
    }
  }
  var root_1$2 = /* @__PURE__ */ from_html(`<span class="moonbundle-cart-drawer-discount-input-spinner"></span>`);
  var root_3$1 = /* @__PURE__ */ from_html(`<p class="moonbundle-cart-drawer-discount-input-error"> </p>`);
  var root$5 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-drawer-discount-input"><div class="moonbundle-cart-drawer-discount-input-wrapper"><input type="text" class="moonbundle-cart-drawer-discount-input-field"/> <button class="moonbundle-cart-drawer-discount-input-btn"><!></button></div> <!></div>`);
  function DiscountInput($$anchor, $$props) {
    push($$props, true);
    let discountCode = /* @__PURE__ */ state("");
    let isLoading = /* @__PURE__ */ state(false);
    let hasError = /* @__PURE__ */ state(false);
    user_effect(() => {
      $$props.itemCount;
      set(hasError, false);
    });
    var div = root$5();
    var div_1 = child(div);
    var input = child(div_1);
    var button = sibling(input, 2);
    button.__click = [
      handleApplyDiscount,
      $$props,
      discountCode,
      isLoading,
      hasError
    ];
    var node = child(button);
    {
      var consequent = ($$anchor2) => {
        var span = root_1$2();
        append($$anchor2, span);
      };
      var alternate = ($$anchor2) => {
        var text$1 = text();
        template_effect(($0) => set_text(text$1, $0), [
          () => getTranslated("discountInput.buttonText") || $$props.discountInputButtonText
        ]);
        append($$anchor2, text$1);
      };
      if_block(node, ($$render) => {
        if (get(isLoading)) $$render(consequent);
        else $$render(alternate, false);
      });
    }
    var node_1 = sibling(div_1, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var p = root_3$1();
        var text_1 = child(p);
        template_effect(($0) => set_text(text_1, $0), [
          () => getTranslated("discountInput.errorMessage") || $$props.discountInputErrorMessage
        ]);
        append($$anchor2, p);
      };
      if_block(node_1, ($$render) => {
        if (get(hasError)) $$render(consequent_1);
      });
    }
    template_effect(
      ($0) => {
        set_attribute(input, "placeholder", $0);
        button.disabled = get(isLoading);
      },
      [
        () => getTranslated("discountInput.placeholder") || $$props.discountInputPlaceholder
      ]
    );
    bind_value(input, () => get(discountCode), ($$value) => set(discountCode, $$value));
    append($$anchor, div);
    pop();
  }
  delegate(["click"]);
  var on_click = (_, handleRemoveDiscount, discount) => handleRemoveDiscount(get(discount).title);
  var root_5 = /* @__PURE__ */ from_html(`<span class="moonbundle-cart-discount-line-badge-spinner"></span>`);
  var root_4 = /* @__PURE__ */ from_html(`<button class="moonbundle-cart-discount-line-badge-remove" aria-label="Remove discount"><!></button>`);
  var root_3 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-discount-line-badge"><svg class="icon icon-discount" viewBox="0 0 12 12"><path fill="currentColor" fill-rule="evenodd" d="M7 0h3a2 2 0 0 1 2 2v3a1 1 0 0 1-.3.7l-6 6a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4l6-6A1 1 0 0 1 7 0m2 2a1 1 0 1 0 2 0 1 1 0 0 0-2 0" clip-rule="evenodd"></path></svg> <span class="moonbundle-cart-discount-line-badge-title"> </span> <!></div>`);
  var root_7 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-drawer-discount-line-price"><span class="moonbundle-cart-drawer-discount-line-price-value"> </span></div>`);
  var root_1$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-drawer-discount-line"><div class="moonbundle-cart-drawer-discount-line-left"><span class="moonbundle-cart-discount-line-label"><!></span> <!></div> <!></div>`);
  function DiscountLine($$anchor, $$props) {
    push($$props, true);
    let isRemoving = /* @__PURE__ */ state(false);
    let discountAmount = /* @__PURE__ */ user_derived(() => {
      const originalPrice = $$props.totalOriginalPriceIfCompareAtPrice ? $$props.totalOriginalPriceIfCompareAtPrice : $$props.originalTotalPrice;
      return originalPrice > $$props.total ? originalPrice - $$props.total : 0;
    });
    async function handleRemoveDiscount(codeToRemove) {
      if ($$props.isPreview === true) return;
      set(isRemoving, true);
      try {
        const remainingCodes = $$props.cartDiscountCodes.filter((d) => d.applicable && d.code.toLowerCase() !== codeToRemove.toLowerCase()).map((d) => d.code).join(",");
        await fetch("/cart/update.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ discount: remainingCodes })
        });
        window.dispatchEvent(new CustomEvent("moonbundle-cart-updated"));
      } finally {
        set(isRemoving, false);
      }
    }
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent_4 = ($$anchor2) => {
        var div = root_1$1();
        var div_1 = child(div);
        var span = child(div_1);
        var node_1 = child(span);
        html(node_1, () => getTranslated("discountLine.textDiscountLineSubtotal") || $$props.textDiscountLineSubtotal);
        var node_2 = sibling(span, 2);
        {
          var consequent_2 = ($$anchor3) => {
            var fragment_1 = comment();
            var node_3 = first_child(fragment_1);
            each(node_3, 17, () => $$props.discountBadges, index, ($$anchor4, discount) => {
              var div_2 = root_3();
              var span_1 = sibling(child(div_2), 2);
              var text$1 = child(span_1);
              var node_4 = sibling(span_1, 2);
              {
                var consequent_1 = ($$anchor5) => {
                  var button = root_4();
                  button.__click = [on_click, handleRemoveDiscount, discount];
                  var node_5 = child(button);
                  {
                    var consequent = ($$anchor6) => {
                      var span_2 = root_5();
                      append($$anchor6, span_2);
                    };
                    var alternate = ($$anchor6) => {
                      var text_1 = text("×");
                      append($$anchor6, text_1);
                    };
                    if_block(node_5, ($$render) => {
                      if (get(isRemoving)) $$render(consequent);
                      else $$render(alternate, false);
                    });
                  }
                  template_effect(() => button.disabled = get(isRemoving));
                  append($$anchor5, button);
                };
                if_block(node_4, ($$render) => {
                  if (get(discount).type === "discount_code") $$render(consequent_1);
                });
              }
              template_effect(($0) => set_text(text$1, $0), [() => stripHtmlTagsForDisplay(get(discount).title)]);
              append($$anchor4, div_2);
            });
            append($$anchor3, fragment_1);
          };
          if_block(node_2, ($$render) => {
            if ($$props.showDiscountBadges && $$props.discountBadges.length > 0) $$render(consequent_2);
          });
        }
        var node_6 = sibling(div_1, 2);
        {
          var consequent_3 = ($$anchor3) => {
            var div_3 = root_7();
            var span_3 = child(div_3);
            var text_2 = child(span_3);
            template_effect(($0) => set_text(text_2, `-${$0 ?? ""}`), [() => $$props.shopifyFormatCurrency(get(discountAmount))]);
            append($$anchor3, div_3);
          };
          if_block(node_6, ($$render) => {
            if (get(discountAmount) > 0) $$render(consequent_3);
          });
        }
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (get(discountAmount) > 0 || $$props.showDiscountBadges && $$props.discountBadges.length > 0) $$render(consequent_4);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  var root_2$1 = /* @__PURE__ */ from_html(`<img class="moonbundle-cart-payment-icon" loading="lazy"/>`);
  var root$4 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-drawer-paymentIconsCart-container"></div>`);
  function PaymentMethods($$anchor, $$props) {
    let listPaymentIcons = prop($$props, "listPaymentIcons", 19, () => ({}));
    var div = root$4();
    each(div, 21, () => Object.entries(listPaymentIcons() || {}), index, ($$anchor2, $$item) => {
      var $$array = /* @__PURE__ */ user_derived(() => to_array(get($$item), 2));
      let key2 = () => get($$array)[0];
      let enabled = () => get($$array)[1];
      var fragment = comment();
      var node = first_child(fragment);
      {
        var consequent = ($$anchor3) => {
          var img = root_2$1();
          template_effect(() => {
            set_attribute(img, "src", `https://moonbundle-assets.fra1.cdn.digitaloceanspaces.com/cart-svg/${key2()}.svg`);
            set_attribute(img, "alt", key2());
          });
          append($$anchor3, img);
        };
        if_block(node, ($$render) => {
          if (enabled()) $$render(consequent);
        });
      }
      append($$anchor2, fragment);
    });
    append($$anchor, div);
  }
  var root_1 = /* @__PURE__ */ from_html(`<p class="moonbundle-toggle-upsell-original-price"><!></p>`);
  var on_change = (e, $$props) => {
    const target = e.target;
    if (target.checked && $$props.toggleUpsellProductData?.variantId) {
      $$props.handleToggleUpsellAddToCart($$props.toggleUpsellProductData?.variantId);
    } else if (!target.checked && $$props.toggleUpsellProductData?.variantId) {
      $$props.handleToggleUpsellRemoveFromCart($$props.toggleUpsellProductData?.variantId);
    }
  };
  var root$3 = /* @__PURE__ */ from_html(`<div class="moonbundle-toggle-upsell-section"><div class="moonbundle-toggle-upsell-container"><div class="moonbundle-toggle-upsell-image-container"><img class="moonbundle-toggle-upsell-image"/></div> <div class="moonbundle-toggle-upsell-content"><h4 class="moonbundle-toggle-upsell-title"> </h4> <p class="moonbundle-toggle-upsell-description"> </p></div> <div class="moonbundle-toggle-upsell-right"><div class="moonbundle-toggle-upsell-price-container"><!> <p class="moonbundle-toggle-upsell-price"><!></p></div> <label class="moonbundle-toggle-upsell-switch"><input type="checkbox"/> <span class="moonbundle-toggle-upsell-slider"></span></label></div></div></div>`);
  function ToggleUpsell($$anchor, $$props) {
    push($$props, true);
    var div = root$3();
    var div_1 = child(div);
    var div_2 = child(div_1);
    var img = child(div_2);
    var div_3 = sibling(div_2, 2);
    var h4 = child(div_3);
    var text2 = child(h4);
    var p = sibling(h4, 2);
    var text_1 = child(p);
    var div_4 = sibling(div_3, 2);
    var div_5 = child(div_4);
    var node = child(div_5);
    {
      var consequent = ($$anchor2) => {
        var p_1 = root_1();
        var node_1 = child(p_1);
        html(node_1, () => $$props.shopifyFormatCurrency($$props.toggleUpsellProductData.compareAtPrice * 100));
        append($$anchor2, p_1);
      };
      if_block(node, ($$render) => {
        if ($$props.toggleUpsellProductData?.compareAtPrice && $$props.toggleUpsellProductData.compareAtPrice > ($$props.toggleUpsellProductData?.price || 0)) $$render(consequent);
      });
    }
    var p_2 = sibling(node, 2);
    var node_2 = child(p_2);
    html(node_2, () => $$props.shopifyFormatCurrency(($$props.toggleUpsellProductData?.price || 0) * 100));
    var label = sibling(div_5, 2);
    var input = child(label);
    input.__change = [on_change, $$props];
    template_effect(() => {
      set_attribute(img, "src", $$props.toggleUpsellProductData?.imageSrc);
      set_attribute(img, "alt", $$props.toggleUpsellProductData?.title);
      set_text(text2, $$props.toggleUpsellProductData?.title || "Shipping Insurance");
      set_text(text_1, $$props.toggleUpsellProductData?.description || "Protect your order from damage, loss, or theft during shipping.");
      set_checked(input, $$props.toggleUpsellEnabled);
    });
    append($$anchor, div);
    pop();
  }
  delegate(["change"]);
  var root_19 = /* @__PURE__ */ from_html(`<button class="moonbundle-cart-drawer-secondary-button"><!></button>`);
  var root_25 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-custom-html-section moonbundle-cart-footer-custom-html"><!></div>`);
  var root$2 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-drawer-footer"></div>`);
  function CartFooter($$anchor, $$props) {
    push($$props, true);
    var div = root$2();
    each(div, 21, () => $$props.footerPositions, index, ($$anchor2, sectionKey) => {
      var fragment = comment();
      var node = first_child(fragment);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_1 = comment();
          var node_1 = first_child(fragment_1);
          {
            var consequent = ($$anchor4) => {
              ToggleUpsell($$anchor4, {
                get toggleUpsellProductData() {
                  return $$props.toggleUpsellProductData;
                },
                get toggleUpsellEnabled() {
                  return $$props.toggleUpsellEnabled;
                },
                get shopifyFormatCurrency() {
                  return $$props.shopifyFormatCurrency;
                },
                get handleToggleUpsellAddToCart() {
                  return $$props.handleToggleUpsellAddToCart;
                },
                get handleToggleUpsellRemoveFromCart() {
                  return $$props.handleToggleUpsellRemoveFromCart;
                }
              });
            };
            if_block(node_1, ($$render) => {
              if ($$props.cartDrawerProps?.toggleUpsell?.isActive && $$props.itemCount > 0) $$render(consequent);
            });
          }
          append($$anchor3, fragment_1);
        };
        var alternate_7 = ($$anchor3) => {
          var fragment_3 = comment();
          var node_2 = first_child(fragment_3);
          {
            var consequent_3 = ($$anchor4) => {
              var fragment_4 = comment();
              var node_3 = first_child(fragment_4);
              {
                var consequent_2 = ($$anchor5) => {
                  {
                    let $0 = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.footerCart?.showDiscountBubble ?? false);
                    CartSubtotal($$anchor5, {
                      get subtotalText() {
                        return $$props.subtotalText;
                      },
                      get totalOriginalPriceIfCompareAtPrice() {
                        return $$props.totalOriginalPriceIfCompareAtPrice;
                      },
                      get originalTotalPrice() {
                        return $$props.originalTotalPrice;
                      },
                      get total() {
                        return $$props.total;
                      },
                      get shopifyFormatCurrency() {
                        return $$props.shopifyFormatCurrency;
                      },
                      get textSaveDiscountSubtotal() {
                        return $$props.textSaveDiscountSubtotal;
                      },
                      get showDiscountBubble() {
                        return get($0);
                      }
                    });
                  }
                };
                if_block(node_3, ($$render) => {
                  if ($$props.cartDrawerProps?.footerCart?.isSubtotalActive) $$render(consequent_2);
                });
              }
              append($$anchor4, fragment_4);
            };
            var alternate_6 = ($$anchor4) => {
              var fragment_6 = comment();
              var node_4 = first_child(fragment_6);
              {
                var consequent_5 = ($$anchor5) => {
                  var fragment_7 = comment();
                  var node_5 = first_child(fragment_7);
                  {
                    var consequent_4 = ($$anchor6) => {
                      {
                        let $0 = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.footerCart?.showDiscountBadges ?? false);
                        DiscountLine($$anchor6, {
                          get totalOriginalPriceIfCompareAtPrice() {
                            return $$props.totalOriginalPriceIfCompareAtPrice;
                          },
                          get originalTotalPrice() {
                            return $$props.originalTotalPrice;
                          },
                          get total() {
                            return $$props.total;
                          },
                          get shopifyFormatCurrency() {
                            return $$props.shopifyFormatCurrency;
                          },
                          get textDiscountLineSubtotal() {
                            return $$props.textDiscountLineSubtotal;
                          },
                          get discountBadges() {
                            return $$props.discountBadges;
                          },
                          get showDiscountBadges() {
                            return get($0);
                          },
                          get cartDiscountCodes() {
                            return $$props.cartDiscountCodes;
                          },
                          get isPreview() {
                            return $$props.isPreview;
                          }
                        });
                      }
                    };
                    if_block(node_5, ($$render) => {
                      if ($$props.cartDrawerProps?.footerCart?.showDiscountLine) $$render(consequent_4);
                    });
                  }
                  append($$anchor5, fragment_7);
                };
                var alternate_5 = ($$anchor5) => {
                  var fragment_9 = comment();
                  var node_6 = first_child(fragment_9);
                  {
                    var consequent_7 = ($$anchor6) => {
                      var fragment_10 = comment();
                      var node_7 = first_child(fragment_10);
                      {
                        var consequent_6 = ($$anchor7) => {
                          DiscountInput($$anchor7, {
                            get discountInputPlaceholder() {
                              return $$props.discountInputPlaceholder;
                            },
                            get discountInputButtonText() {
                              return $$props.discountInputButtonText;
                            },
                            get discountInputErrorMessage() {
                              return $$props.discountInputErrorMessage;
                            },
                            get itemCount() {
                              return $$props.itemCount;
                            },
                            get cartDiscountCodes() {
                              return $$props.cartDiscountCodes;
                            },
                            get isPreview() {
                              return $$props.isPreview;
                            }
                          });
                        };
                        if_block(node_7, ($$render) => {
                          if ($$props.cartDrawerProps?.footerCart?.discountInput?.isActive) $$render(consequent_6);
                        });
                      }
                      append($$anchor6, fragment_10);
                    };
                    var alternate_4 = ($$anchor6) => {
                      var fragment_12 = comment();
                      var node_8 = first_child(fragment_12);
                      {
                        var consequent_8 = ($$anchor7) => {
                          {
                            let $0 = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.footerCart?.acceleratedCheckout?.isActive ?? false);
                            let $1 = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.footerCart?.acceleratedCheckout?.text || "Express checkout");
                            let $2 = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.footerCart?.acceleratedCheckout?.isTextExpressCheckout ?? true);
                            let $3 = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.footerCart?.acceleratedCheckout?.isTextExpressCheckoutOpen ?? false);
                            AcceleratedCheckout($$anchor7, {
                              get isActive() {
                                return get($0);
                              },
                              get text() {
                                return get($1);
                              },
                              get isTextExpressCheckout() {
                                return get($2);
                              },
                              get isTextExpressCheckoutOpen() {
                                return get($3);
                              },
                              get isPreview() {
                                return $$props.isPreview;
                              },
                              get acceleratedCheckoutHtml() {
                                return $$props.acceleratedCheckoutHtml;
                              },
                              get itemCount() {
                                return $$props.itemCount;
                              }
                            });
                          }
                        };
                        var alternate_3 = ($$anchor7) => {
                          var fragment_14 = comment();
                          var node_9 = first_child(fragment_14);
                          {
                            var consequent_9 = ($$anchor8) => {
                              CheckoutButton($$anchor8, {
                                get itemCount() {
                                  return $$props.itemCount;
                                },
                                get loadingCheckout() {
                                  return $$props.loadingCheckout;
                                },
                                get checkoutButtonText() {
                                  return $$props.checkoutButtonText;
                                },
                                get handleCheckoutClick() {
                                  return $$props.handleCheckoutClick;
                                },
                                get cartDrawerProps() {
                                  return $$props.cartDrawerProps;
                                }
                              });
                            };
                            var alternate_2 = ($$anchor8) => {
                              var fragment_16 = comment();
                              var node_10 = first_child(fragment_16);
                              {
                                var consequent_11 = ($$anchor9) => {
                                  var fragment_17 = comment();
                                  var node_11 = first_child(fragment_17);
                                  {
                                    var consequent_10 = ($$anchor10) => {
                                      var button = root_19();
                                      button.__click = function(...$$args) {
                                        $$props.handleSecondaryButtonClick?.apply(this, $$args);
                                      };
                                      var node_12 = child(button);
                                      html(node_12, () => getTranslated("footer.secondaryButtonText") || $$props.cartDrawerProps?.footerCart?.secondaryButton?.text || "");
                                      append($$anchor10, button);
                                    };
                                    if_block(node_11, ($$render) => {
                                      if ($$props.cartDrawerProps?.footerCart?.secondaryButton?.isActive) $$render(consequent_10);
                                    });
                                  }
                                  append($$anchor9, fragment_17);
                                };
                                var alternate_1 = ($$anchor9) => {
                                  var fragment_18 = comment();
                                  var node_13 = first_child(fragment_18);
                                  {
                                    var consequent_13 = ($$anchor10) => {
                                      var fragment_19 = comment();
                                      var node_14 = first_child(fragment_19);
                                      {
                                        var consequent_12 = ($$anchor11) => {
                                          {
                                            let $0 = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps?.paymentIconsCart?.listPaymentIcons);
                                            PaymentMethods($$anchor11, {
                                              get listPaymentIcons() {
                                                return get($0);
                                              }
                                            });
                                          }
                                        };
                                        if_block(node_14, ($$render) => {
                                          if ($$props.cartDrawerProps?.paymentIconsCart?.isActive) $$render(consequent_12);
                                        });
                                      }
                                      append($$anchor10, fragment_19);
                                    };
                                    var alternate = ($$anchor10) => {
                                      var fragment_21 = comment();
                                      var node_15 = first_child(fragment_21);
                                      {
                                        var consequent_15 = ($$anchor11) => {
                                          var fragment_22 = comment();
                                          const sectionId = /* @__PURE__ */ user_derived(() => get(sectionKey).replace("customHtml-", ""));
                                          const customHtmlSection = /* @__PURE__ */ user_derived(() => $$props.cartDrawerProps.footerCart.customHtmlSections.find((c) => c.id === get(sectionId)));
                                          var node_16 = first_child(fragment_22);
                                          {
                                            var consequent_14 = ($$anchor12) => {
                                              var div_1 = root_25();
                                              var node_17 = child(div_1);
                                              html(node_17, () => get(customHtmlSection).code);
                                              template_effect(() => {
                                                set_attribute(div_1, "data-section-id", get(customHtmlSection).id);
                                                set_attribute(div_1, "data-section-name", get(customHtmlSection).name);
                                              });
                                              append($$anchor12, div_1);
                                            };
                                            if_block(node_16, ($$render) => {
                                              if (get(customHtmlSection)?.code) $$render(consequent_14);
                                            });
                                          }
                                          append($$anchor11, fragment_22);
                                        };
                                        if_block(
                                          node_15,
                                          ($$render) => {
                                            if (get(sectionKey).startsWith("customHtml-") && $$props.cartDrawerProps?.footerCart?.customHtmlSections) $$render(consequent_15);
                                          },
                                          true
                                        );
                                      }
                                      append($$anchor10, fragment_21);
                                    };
                                    if_block(
                                      node_13,
                                      ($$render) => {
                                        if (get(sectionKey) === "paymentMethods") $$render(consequent_13);
                                        else $$render(alternate, false);
                                      },
                                      true
                                    );
                                  }
                                  append($$anchor9, fragment_18);
                                };
                                if_block(
                                  node_10,
                                  ($$render) => {
                                    if (get(sectionKey) === "secondaryButton") $$render(consequent_11);
                                    else $$render(alternate_1, false);
                                  },
                                  true
                                );
                              }
                              append($$anchor8, fragment_16);
                            };
                            if_block(
                              node_9,
                              ($$render) => {
                                if (get(sectionKey) === "checkout") $$render(consequent_9);
                                else $$render(alternate_2, false);
                              },
                              true
                            );
                          }
                          append($$anchor7, fragment_14);
                        };
                        if_block(
                          node_8,
                          ($$render) => {
                            if (get(sectionKey) === "acceleratedCheckout") $$render(consequent_8);
                            else $$render(alternate_3, false);
                          },
                          true
                        );
                      }
                      append($$anchor6, fragment_12);
                    };
                    if_block(
                      node_6,
                      ($$render) => {
                        if (get(sectionKey) === "discountInput") $$render(consequent_7);
                        else $$render(alternate_4, false);
                      },
                      true
                    );
                  }
                  append($$anchor5, fragment_9);
                };
                if_block(
                  node_4,
                  ($$render) => {
                    if (get(sectionKey) === "discountLine") $$render(consequent_5);
                    else $$render(alternate_5, false);
                  },
                  true
                );
              }
              append($$anchor4, fragment_6);
            };
            if_block(
              node_2,
              ($$render) => {
                if (get(sectionKey) === "subtotal") $$render(consequent_3);
                else $$render(alternate_6, false);
              },
              true
            );
          }
          append($$anchor3, fragment_3);
        };
        if_block(node, ($$render) => {
          if (get(sectionKey) === "toggleUpsell") $$render(consequent_1);
          else $$render(alternate_7, false);
        });
      }
      append($$anchor2, fragment);
    });
    append($$anchor, div);
    pop();
  }
  delegate(["click"]);
  var root$1 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-drawer-header"><div class="moonbundle-cart-drawer-header-left"><h3 class="moonbundle-cart-drawer-header-title"><!></h3> <span class="moonbundle-cart-drawer-header-item-count"> </span></div> <button class="moonbundle-cart-drawer-close" aria-label="close the cart drawer"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div>`);
  function CartHeader($$anchor, $$props) {
    push($$props, true);
    let headerText = prop($$props, "headerText", 3, ""), itemCount = prop($$props, "itemCount", 3, 0);
    var div = root$1();
    var div_1 = child(div);
    var h3 = child(div_1);
    var node = child(h3);
    html(node, () => getTranslated("header.textHeader") || headerText());
    var span = sibling(h3, 2);
    var text2 = child(span);
    template_effect(() => set_text(text2, itemCount()));
    append($$anchor, div);
    pop();
  }
  var root_13 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-custom-html-section"><!></div>`);
  var root_15 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-body-items"><!></div>`);
  var root_2 = /* @__PURE__ */ from_html(`<div class="moonbundle-cart-body-scrollable"></div> <!>`, 1);
  var root = /* @__PURE__ */ from_html(`<div id="moonbundle-cart-drawer" data-open="false"><div class="moonbundle-cart-drawer-overlay" id="moonbundle-cart-drawer-overlay" aria-hidden="true"></div> <div class="moonbundle-cart-drawer-content"><!> <!></div></div>`);
  function CartDrawerMoon($$anchor, $$props) {
    push($$props, true);
    let initialCart = prop($$props, "cart", 3, null), initialCartDrawerProps = prop($$props, "cartDrawerProps", 3, null), initialShopMoneyFormat = prop($$props, "shopMoneyFormat", 3, null), globalCustomCss = prop($$props, "globalCustomCss", 7, null), globalCustomJs = prop($$props, "globalCustomJs", 7, null), acceleratedCheckoutHtml = prop($$props, "acceleratedCheckoutHtml", 3, null);
    prop($$props, "onStateChanged", 3, null);
    let onSvelteComponentReady = prop($$props, "onSvelteComponentReady", 3, null), onSubscriptionChange = prop($$props, "onSubscriptionChange", 3, null), initialCountry = prop($$props, "country", 3, null), previewLocale = prop($$props, "previewLocale", 7, null), shop = prop($$props, "shop", 3, null), isPreview = prop($$props, "isPreview", 3, null);
    let cart = /* @__PURE__ */ state(proxy(initialCart()));
    let cartDrawerProps = /* @__PURE__ */ state(proxy(initialCartDrawerProps()));
    let shopMoneyFormat = /* @__PURE__ */ state(proxy(initialShopMoneyFormat()));
    let country = /* @__PURE__ */ state(proxy(initialCountry()));
    let upsellProductsData = /* @__PURE__ */ state(null);
    let toggleUpsellProductData = /* @__PURE__ */ state(null);
    let currencyRate = /* @__PURE__ */ state(1);
    let progressBarGiftVariantAvailability = /* @__PURE__ */ state(proxy({}));
    const locale = /* @__PURE__ */ user_derived(() => previewLocale() || (typeof window !== "undefined" ? window.Shopify?.locale : null));
    let translations = /* @__PURE__ */ user_derived(() => get(locale) ? get(cartDrawerProps)?.translations?.[get(locale)] ?? null : null);
    setTranslationContext(() => get(translations));
    const defaultBodyPositions = [
      "timer",
      "progressBar",
      "bannerImage",
      "additionalText",
      "product",
      "upsell"
    ];
    let bodyPositions = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.bodyPositions && get(cartDrawerProps).bodyPositions.length > 0 ? get(cartDrawerProps).bodyPositions : defaultBodyPositions);
    let toggleUpsellEnabled = /* @__PURE__ */ user_derived(() => {
      if (!get(cart)?.items || !get(toggleUpsellProductData)?.variantId) {
        return false;
      }
      const variantIdNumber = parseInt(get(toggleUpsellProductData).variantId.split("/").pop() || "0");
      return get(cart).items.some((item) => item.properties?._moonBundleCart === "toggleUpsell" && item.variant_id === variantIdNumber);
    });
    let currentUpsellIndex = /* @__PURE__ */ state(0);
    let activeUpsellCount = /* @__PURE__ */ state(0);
    let touchStartX = /* @__PURE__ */ state(0);
    let touchEndX = /* @__PURE__ */ state(0);
    let touchStartY = /* @__PURE__ */ state(0);
    let touchEndY = /* @__PURE__ */ state(0);
    let subtotalText = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.footerCart?.subtotalText || "");
    let footerPositions = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.footerPositions || ["toggleUpsell", "subtotal", "checkout", "paymentMethods"]);
    let textSubtitleSub = /* @__PURE__ */ user_derived(() => getTranslated("lineProduct.textSubtitleSub") || get(cartDrawerProps)?.lineProductCart?.textSubtitleSub || "");
    let textDiscountSub = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.lineProductCart?.textDiscountSub || "");
    let textDiscountOff = /* @__PURE__ */ user_derived(() => getTranslated("global.textOffDiscount") || get(cartDrawerProps)?.globalTexts?.textOffDiscount || "");
    let textFreeGift = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.globalTexts?.freeGift);
    let textSaveDiscountSubtotal = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.footerCart?.textSaveDiscountSubtotal);
    let textDiscountLineSubtotal = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.footerCart?.textDiscountLineSubtotal);
    let discountInputPlaceholder = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.footerCart?.discountInput?.placeholder || "Discount code");
    let discountInputButtonText = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.footerCart?.discountInput?.buttonText || "Apply");
    let discountInputErrorMessage = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.footerCart?.discountInput?.errorMessage || "The discount code is invalid or cannot be added to this cart");
    let discountBadges = /* @__PURE__ */ user_derived(() => {
      const codes = (get(cart)?.discount_codes ?? []).filter((d) => d.applicable).map((d) => ({ title: d.code, type: "discount_code" }));
      const codesTitles = new Set(codes.map((d) => d.title.toLowerCase()));
      const itemDiscounts = Array.from(new Set((get(cart)?.items ?? []).flatMap((item) => (item.discounts ?? []).map((d) => d.title)))).filter((title) => !codesTitles.has(title.toLowerCase())).map((title) => ({ title, type: "item_discount" }));
      return [...codes, ...itemDiscounts];
    });
    let cartDisabled = /* @__PURE__ */ state(false);
    let loadingItems = /* @__PURE__ */ state(proxy(/* @__PURE__ */ new Set()));
    let loadingUpsell = /* @__PURE__ */ state(false);
    let loadingCheckout = /* @__PURE__ */ state(false);
    let isCartLoading = /* @__PURE__ */ state(false);
    function filterToggleUpsellItems(items) {
      if (!items) return [];
      return items.filter((item) => {
        return !item.properties || item.properties._moonBundleCart !== "toggleUpsell";
      });
    }
    let filteredItems = /* @__PURE__ */ user_derived(() => {
      if (!get(cart)?.items) return [];
      return filterToggleUpsellItems(get(cart).items);
    });
    let originalTotalPrice = /* @__PURE__ */ user_derived(() => get(cart)?.original_total_price || 0);
    let total = /* @__PURE__ */ user_derived(() => get(cart)?.total_price || 0);
    let itemCount = /* @__PURE__ */ user_derived(() => get(cart)?.item_count || 0);
    let checkoutButtonText = /* @__PURE__ */ user_derived(() => (() => {
      const buttonText = getTranslated("footer.textCheckoutButton") || get(cartDrawerProps)?.footerCart?.textCheckoutButton || "";
      if (hasDynamicVariable(buttonText, "cart_total")) {
        return replaceDynamicVariable(buttonText, "cart_total", shopifyFormatCurrency(get(total)));
      }
      return buttonText;
    })());
    let itemCountWithoutGifts = /* @__PURE__ */ user_derived(() => {
      if (!get(cart)?.items) return 0;
      return get(cart).items.reduce(
        (count, item) => {
          const moonBundleCartProp = item.properties?._moonBundleCart;
          const isProgressBarGift2 = moonBundleCartProp && moonBundleCartProp !== "upsell" && moonBundleCartProp !== "toggleUpsell";
          if (isProgressBarGift2) {
            return count;
          }
          return count + item.quantity;
        },
        0
      );
    });
    let totalForProgressBar = /* @__PURE__ */ user_derived(() => {
      if (!get(cart)) return 0;
      let adjustedTotal = get(cart).total_price || 0;
      if (get(cart).cart_level_discount_applications) {
        for (const discount of get(cart).cart_level_discount_applications) {
          if (discount.title?.startsWith("MbCart")) {
            adjustedTotal += discount.total_allocated_amount;
          }
        }
      }
      return adjustedTotal;
    });
    let totalOriginalPriceIfCompareAtPrice = /* @__PURE__ */ user_derived(() => {
      if (!get(cart)?.items) return 0;
      return get(cart).items.reduce(
        (sum, item) => {
          return sum + getItemOriginalPrice(item);
        },
        0
      );
    });
    function getItemOriginalPrice(item) {
      const qty = item.quantity || 1;
      if (item.compare_at_price) {
        return item.compare_at_price * qty;
      }
      if (item.selling_plan_allocation?.compare_at_price) {
        return item.selling_plan_allocation.compare_at_price * qty;
      }
      return item.original_line_price || 0;
    }
    function calculateItemDiscount(item) {
      const originalPrice = getItemOriginalPrice(item);
      const finalPrice = item.final_line_price || 0;
      return Math.max(0, originalPrice - finalPrice);
    }
    function getSubtitleWithDiscount(item) {
      const subtitle = get(textSubtitleSub) || "";
      if (!subtitle || !hasDynamicVariable(subtitle, "discount")) return subtitle;
      let originalPrice = 0;
      let finalPrice = item.final_line_price || 0;
      if (item.selling_plan_allocation?.compare_at_price) {
        originalPrice = item.selling_plan_allocation.compare_at_price;
        if (item.quantity) {
          originalPrice = originalPrice * item.quantity;
        }
      } else if (item.subscriptionData && item.subscriptionData.length > 0) {
        const firstGroup = item.subscriptionData[0];
        const firstPlan = firstGroup?.sellingPlans && firstGroup.sellingPlans.length > 0 ? firstGroup.sellingPlans[0] : void 0;
        if (isPreview() === true) {
          if (firstPlan?.compareAtPrice && firstPlan?.price) {
            const compareAtPriceValue = Number(firstPlan.compareAtPrice) * 100;
            if (item.quantity) {
              originalPrice = Math.round(compareAtPriceValue * item.quantity);
            } else {
              originalPrice = Math.round(compareAtPriceValue);
            }
            const planFinalUnitPrice = Number(firstPlan.price) * 100;
            const qty = item.quantity || 1;
            finalPrice = Math.round(planFinalUnitPrice * qty);
          }
        } else {
          const adjustment = firstPlan?.priceAdjustments && firstPlan.priceAdjustments.length > 0 ? firstPlan.priceAdjustments[0]?.adjustmentValue : void 0;
          if (adjustment?.adjustmentPercentage != null) {
            const percentage = adjustment.adjustmentPercentage;
            const baseFinalLinePrice = item.final_line_price || 0;
            if (percentage > 0 && percentage < 100 && baseFinalLinePrice > 0) {
              originalPrice = Math.round(baseFinalLinePrice / (1 - percentage / 100));
            }
          }
        }
      }
      const percent = originalPrice > 0 ? Math.round((originalPrice - finalPrice) / originalPrice * 100) : 0;
      if (percent <= 0) return replaceDynamicVariable(subtitle, "discount", "");
      return replaceDynamicVariable(subtitle, "discount", `${percent}%`);
    }
    let upsellConfigMap = /* @__PURE__ */ user_derived(() => new Map((get(cartDrawerProps)?.upsellCart?.upsellProducts ?? []).map((p) => [p.productId, p])));
    function getUpsellConfig(upsellProduct) {
      return get(upsellConfigMap).get(upsellProduct.productId);
    }
    function getUpsellOriginalPrice(upsellProduct) {
      let originalPrice = upsellProduct.compare_at_price || upsellProduct.original_line_price || 0;
      return originalPrice;
    }
    function getUpsellFinalPrice(upsellProduct) {
      const basePrice = upsellProduct.compare_at_price || upsellProduct.original_line_price || 0;
      const discountAmount = getUpsellDiscountAmount(upsellProduct) || 0;
      return Math.max(0, basePrice - discountAmount);
    }
    function getUpsellDiscountAmount(upsellProduct) {
      let baseDiscountAmount = 0;
      const upsellConfig = getUpsellConfig(upsellProduct);
      if (upsellConfig) {
        if (upsellConfig.discountAmount && upsellConfig.discountType) {
          const discountAmount = parseFloat(upsellConfig.discountAmount);
          if (upsellConfig.discountType === "percentage") {
            const originalPrice = upsellProduct.original_line_price;
            baseDiscountAmount = Math.round(originalPrice * discountAmount / 100);
          } else if (upsellConfig.discountType === "fixed_amount") {
            const rate = typeof get(currencyRate) === "number" && isFinite(get(currencyRate)) ? get(currencyRate) : 1;
            baseDiscountAmount = Math.round(discountAmount * 100 * rate);
          }
        }
      }
      if (upsellProduct.compare_at_price && upsellProduct.original_line_price && upsellProduct.compare_at_price > upsellProduct.original_line_price) {
        const priceDifference = upsellProduct.compare_at_price - upsellProduct.original_line_price;
        baseDiscountAmount += Math.round(priceDifference);
      }
      return baseDiscountAmount;
    }
    function applyDiscountText(discountStr) {
      return hasDynamicVariable(get(textDiscountOff), "discount_amount") ? replaceDynamicVariable(get(textDiscountOff), "discount_amount", discountStr) : `${discountStr} ${get(textDiscountOff)}`;
    }
    function formatDiscountDisplay(upsellProduct) {
      const upsellConfig = getUpsellConfig(upsellProduct);
      if (upsellConfig) {
        if (upsellConfig.discountType === "percentage" && upsellConfig.discountAmount) {
          if (upsellProduct.compare_at_price && upsellProduct.compare_at_price > 0) {
            const originalPrice = upsellProduct.compare_at_price;
            const finalPrice = getUpsellFinalPrice(upsellProduct);
            const actualDiscountPercentage = Math.round((originalPrice - finalPrice) / originalPrice * 100);
            return applyDiscountText(`${actualDiscountPercentage}%`);
          }
          return applyDiscountText(`${upsellConfig.discountAmount}%`);
        } else if (upsellConfig?.discountType === "fixed_amount") {
          return applyDiscountText(shopifyFormatCurrency(getUpsellDiscountAmount(upsellProduct)));
        }
      }
      if (upsellProduct.discountType === "percentage" && upsellProduct.discountAmount) {
        if (upsellProduct.compare_at_price && upsellProduct.compare_at_price > 0) {
          const originalPrice = upsellProduct.compare_at_price;
          const finalPrice = getUpsellFinalPrice(upsellProduct);
          const actualDiscountPercentage = Math.round((originalPrice - finalPrice) / originalPrice * 100);
          return applyDiscountText(`${actualDiscountPercentage}%`);
        }
        return applyDiscountText(`${upsellProduct.discountAmount}%`);
      } else if (upsellProduct.discountType === "fixed_amount") {
        return applyDiscountText(shopifyFormatCurrency(getUpsellDiscountAmount(upsellProduct)));
      }
      return applyDiscountText(shopifyFormatCurrency(getUpsellDiscountAmount(upsellProduct)));
    }
    function resetCheckoutLoadingStateIfNeeded() {
      if (get(loadingCheckout)) {
        set(loadingCheckout, false);
        set(cartDisabled, false);
      }
    }
    const handlePageShow = (event) => {
      if (event?.persisted) {
        resetCheckoutLoadingStateIfNeeded();
        return;
      }
      resetCheckoutLoadingStateIfNeeded();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetCheckoutLoadingStateIfNeeded();
      }
    };
    onMount(() => {
      window.addEventListener("pageshow", handlePageShow);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      if (onSvelteComponentReady()) {
        onSvelteComponentReady()();
      }
      if (get(cart)) {
        verifyDiscounts();
      }
    });
    user_effect(() => {
      if (get(cartDrawerProps)) {
        const shopifyActiveCurrency = window?.Shopify?.currency?.active;
        const marketCurrencyCode = get(cartDrawerProps).market && get(cartDrawerProps).market !== "all" ? get(cartDrawerProps).market.currencyCode : null;
        if (marketCurrencyCode && shopifyActiveCurrency && marketCurrencyCode === shopifyActiveCurrency) {
          set(currencyRate, 1);
        } else {
          set(currencyRate, parseFloat(window?.Shopify?.currency?.rate ?? "1") || 1, true);
        }
      }
    });
    function executeCustomJavaScript() {
      if (!get(cartDrawerProps)?.customJs) return;
      const scriptId = "moonbundle-cart-custom-js";
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
      try {
        const scriptElement = document.createElement("script");
        scriptElement.id = scriptId;
        scriptElement.type = "text/javascript";
        scriptElement.textContent = get(cartDrawerProps).customJs;
        document.body.appendChild(scriptElement);
      } catch (error) {
        console.error("Error executing custom JS:", error);
      }
    }
    function applyCustomCSS() {
      const styleId = "moonbundle-cart-custom-css";
      const existingStyle = document.getElementById(styleId);
      if (!get(cartDrawerProps)?.customCss) {
        if (existingStyle) existingStyle.remove();
        return;
      }
      let styleElement = existingStyle;
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = get(cartDrawerProps).customCss;
    }
    function applyGlobalCustomCSS() {
      const styleId = "moonbundle-cart-global-custom-css";
      const existingStyle = document.getElementById(styleId);
      if (!globalCustomCss()) {
        if (existingStyle) existingStyle.remove();
        return;
      }
      let styleElement = existingStyle;
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = globalCustomCss();
    }
    function executeGlobalCustomJavaScript() {
      const scriptId = "moonbundle-cart-global-custom-js";
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
      if (!globalCustomJs()) return;
      const scriptElement = document.createElement("script");
      scriptElement.id = scriptId;
      scriptElement.type = "text/javascript";
      try {
        scriptElement.textContent = globalCustomJs();
        document.body.appendChild(scriptElement);
      } catch (error) {
        console.error("Error executing global cart custom JS:", error);
      }
    }
    user_effect(() => {
      if (get(cartDrawerProps)?.customJs) {
        executeCustomJavaScript();
      } else {
        document.getElementById("moonbundle-cart-custom-js")?.remove();
      }
    });
    user_effect(() => {
      applyCustomCSS();
    });
    user_effect(() => {
      applyGlobalCustomCSS();
    });
    user_effect(() => {
      executeGlobalCustomJavaScript();
    });
    onDestroy(() => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.getElementById("moonbundle-cart-global-custom-css")?.remove();
      document.getElementById("moonbundle-cart-global-custom-js")?.remove();
    });
    function updateCart(newCart) {
      set(cart, newCart, true);
      manageGiftProducts();
    }
    function setCartLoading(loading) {
      set(isCartLoading, loading, true);
    }
    function updateCartDrawerProps(newCartDrawerProps) {
      set(cartDrawerProps, newCartDrawerProps, true);
    }
    function updateGlobalCustom(css, js) {
      globalCustomCss(css);
      globalCustomJs(js);
    }
    function updateLocale(newLocale) {
      previewLocale(newLocale);
    }
    function handleCheckoutClick() {
      if (isPreview() === true) {
        return;
      }
      set(loadingCheckout, true);
      set(cartDisabled, true);
      window.location.href = "/checkout";
    }
    function handleSecondaryButtonClick() {
      if (isPreview() === true) {
        return;
      }
      const buttonAction = get(cartDrawerProps)?.footerCart?.secondaryButton?.buttonAction;
      if (!buttonAction) {
        return;
      }
      if (buttonAction === "close cart") {
        window.closeMoonBundleCartDrawer?.();
      } else if (buttonAction === "redirect checkout") {
        set(loadingCheckout, true);
        set(cartDisabled, true);
        window.location.href = "/checkout";
      } else if (buttonAction === "custom url") {
        const customUrl = get(cartDrawerProps)?.footerCart?.secondaryButton?.customUrl;
        if (customUrl) {
          window.location.href = customUrl;
        }
      }
    }
    function nextUpsell() {
      if (get(activeUpsellCount) > 0) {
        set(currentUpsellIndex, (get(currentUpsellIndex) + 1) % get(activeUpsellCount));
      }
    }
    function previousUpsell() {
      if (get(activeUpsellCount) > 0) {
        set(
          currentUpsellIndex,
          get(currentUpsellIndex) === 0 ? get(activeUpsellCount) - 1 : get(currentUpsellIndex) - 1,
          true
        );
      }
    }
    function handleTouchStart(e) {
      set(touchStartX, e.touches[0].clientX, true);
      set(touchStartY, e.touches[0].clientY, true);
    }
    function handleTouchMove(e) {
      set(touchEndX, e.touches[0].clientX, true);
      set(touchEndY, e.touches[0].clientY, true);
    }
    function handleTouchEnd() {
      if (!get(touchStartX) || !get(touchEndX) || !get(touchStartY) || !get(touchEndY)) return;
      const swipeDistanceX = get(touchStartX) - get(touchEndX);
      const swipeDistanceY = get(touchStartY) - get(touchEndY);
      const minSwipeDistance = 50;
      const isHorizontalSwipe = Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY);
      if (isHorizontalSwipe && Math.abs(swipeDistanceX) > minSwipeDistance) {
        if (swipeDistanceX > 0) {
          nextUpsell();
        } else {
          previousUpsell();
        }
      }
      set(touchStartX, 0);
      set(touchEndX, 0);
      set(touchStartY, 0);
      set(touchEndY, 0);
    }
    function enrichCartWithGraphqlDatas(cartData, completedMerchandiseData) {
      console.log("cartData");
      if (!cartData) {
        return cartData;
      }
      const enrichedItems = cartData.items.map((item, index2) => {
        const itemData = completedMerchandiseData[index2];
        let compareAtPrice = itemData?.compare_at_price || item.compare_at_price;
        let dataOptionsValuesEnriched = itemData?.optionsValuesEnriched || null;
        let productId = itemData?.productId || item.productId;
        let idMerchandiseLine = itemData?.idMerchandiseLine || "";
        let subscriptionData = itemData?.subscriptionData || void 0;
        let reviewRating = itemData?.reviewRating ?? item.reviewRating ?? null;
        let reviewCount = itemData?.reviewCount ?? item.reviewCount ?? null;
        if (compareAtPrice && typeof compareAtPrice === "number") {
          compareAtPrice = Math.round(compareAtPrice * 100);
        }
        return {
          ...item,
          compare_at_price: compareAtPrice,
          optionsValuesEnriched: dataOptionsValuesEnriched,
          //from graphql
          productId,
          idMerchandiseLine,
          subscriptionData,
          //from graphql
          reviewRating,
          reviewCount,
          // Préserver les propriétés existantes (comme _moonBundleCart)
          properties: item.properties || {}
        };
      });
      set(cart, { ...cartData, items: enrichedItems }, true);
      return get(cart);
    }
    function shopifyFormatCurrency(cents) {
      const formatString = get(shopMoneyFormat);
      if (!formatString) return cents?.toString();
      const placeholderRegex = /{{\s*(\w+)\s*}}/;
      function decodeHtmlEntities(text2) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text2;
        return textarea.value;
      }
      function formatWithDelimiters(number, precision = 2, thousands = ",", decimal = ".") {
        if (isNaN(number) || number == null) {
          return "0";
        }
        const numString = (number / 100).toFixed(precision);
        const parts = numString.split(".");
        const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands);
        const cents2 = parts[1] ? decimal + parts[1] : "";
        return dollars + cents2;
      }
      const formattedString = formatString.replace(placeholderRegex, (match, placeholder) => {
        switch (placeholder) {
          case "amount":
            return formatWithDelimiters(cents, 2);
          case "amount_no_decimals":
            return formatWithDelimiters(cents, 0);
          case "amount_with_comma_separator":
            return formatWithDelimiters(cents, 2, ".", ",");
          case "amount_no_decimals_with_comma_separator":
            return formatWithDelimiters(cents, 0, ".", ",");
          case "amount_with_apostrophe_separator":
            return formatWithDelimiters(cents, 2, "'", ".");
          case "amount_no_decimals_with_space_separator":
            return formatWithDelimiters(cents, 0, " ");
          case "amount_with_space_separator":
            return formatWithDelimiters(cents, 2, " ", ",");
          case "amount_with_period_and_space_separator":
            return formatWithDelimiters(cents, 2, " ", ".");
          default:
            return match;
        }
      });
      const decodedString = decodeHtmlEntities(formattedString);
      return decodedString.replace(/<[^>]*>/g, "");
    }
    function handleSubscriptionChange(event, itemKey, quantity) {
      const target = event.target;
      const sellingPlanId = target.value;
      if (onSubscriptionChange()) {
        onSubscriptionChange()({
          itemKey,
          sellingPlanId,
          quantity,
          action: "changeSubscription"
        });
      }
      const customEvent = new CustomEvent("moonbundle-subscription-changed", {
        detail: {
          itemKey,
          sellingPlanId,
          quantity,
          action: "changeSubscription"
        }
      });
      document.dispatchEvent(customEvent);
    }
    function handleSubscriptionToggle(event, itemKey, quantity) {
      const target = event.target;
      const isSubscribed = target.checked;
      const sellingPlanId = target.value;
      if (onSubscriptionChange()) {
        onSubscriptionChange()({
          itemKey,
          isSubscribed,
          sellingPlanId,
          quantity,
          action: isSubscribed ? "enableSubscription" : "disableSubscription"
        });
      }
      const customEvent = new CustomEvent("moonbundle-subscription-changed", {
        detail: {
          itemKey,
          isSubscribed,
          sellingPlanId,
          quantity,
          action: isSubscribed ? "enableSubscription" : "disableSubscription"
        }
      });
      document.dispatchEvent(customEvent);
    }
    function enableLoading(action, itemKey) {
      set(
        cartDisabled,
        true
        //disable all pointer
      );
      if (action === "changeVariant") {
        return;
      }
      if (action === "increase" || action === "decrease" || action === "remove") {
        set(loadingItems, /* @__PURE__ */ new Set([...get(loadingItems), `${action}-${itemKey}`]), true);
      }
    }
    function disableLoading(action, itemKey) {
      set(cartDisabled, false);
      const newLoadingItems = new Set(get(loadingItems));
      newLoadingItems.delete(`${action}-${itemKey}`);
      set(loadingItems, newLoadingItems, true);
    }
    function updateUpsellProducts(upsellProducts) {
      const previous = get(upsellProductsData) || [];
      const merged = (upsellProducts || []).map((incoming) => {
        const prevMatch = previous.find((p) => p.productId === incoming.productId);
        if (!prevMatch) return incoming;
        return {
          ...incoming,
          variant_id: prevMatch.variant_id != null ? prevMatch.variant_id : incoming.variant_id,
          compare_at_price: prevMatch.compare_at_price != null ? prevMatch.compare_at_price : incoming.compare_at_price,
          original_line_price: prevMatch.original_line_price != null ? prevMatch.original_line_price : incoming.original_line_price,
          image: prevMatch.image || incoming.image,
          options_with_values: prevMatch.options_with_values || incoming.options_with_values,
          availableForSale: prevMatch.availableForSale != null ? prevMatch.availableForSale : incoming.availableForSale,
          // Conserver les options enrichies entrantes si fournies, sinon fallback sur l'ancienne valeur
          optionsValuesEnriched: incoming.optionsValuesEnriched || prevMatch.optionsValuesEnriched
        };
      });
      set(upsellProductsData, merged, true);
      if (upsellProducts && upsellProducts.length > 0 && get(currentUpsellIndex) >= upsellProducts.length) {
        set(currentUpsellIndex, 0);
      }
    }
    async function handleUpsellAddToCart(upsellProduct) {
      if (isPreview() === true) {
        return;
      }
      const resolvedUpsell = get(upsellProductsData)?.find((p) => p.productId === upsellProduct.productId) ?? upsellProduct;
      if (!resolvedUpsell.variant_id) {
        console.error("Upsell add to cart: missing variant_id", resolvedUpsell);
        return;
      }
      set(cartDisabled, true);
      set(loadingUpsell, true);
      try {
        const payload = {
          items: [
            {
              id: resolvedUpsell.variant_id,
              quantity: 1,
              properties: { _moonBundleCart: "upsell" }
            }
          ]
        };
        const response = await fetch("/cart/add.js?moonbundle_cart=true", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || "Failed to add to cart");
        }
        window.dispatchEvent(new CustomEvent("moonbundle-cart-updated"));
      } catch (error) {
        console.error("Error adding upsell to cart:", error);
      } finally {
        set(cartDisabled, false);
        set(loadingUpsell, false);
      }
    }
    async function handleToggleUpsellRemoveFromCart(variantId) {
      if (isPreview() === true) {
        return;
      }
      const itemId = variantId.split("/").pop();
      try {
        let updates = { [itemId]: 0 };
        const response = await fetch("/cart/update.js?moonbundle_cart=true", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({ updates })
        });
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || "Failed to remove from cart");
        }
        window.dispatchEvent(new CustomEvent("moonbundle-cart-updated"));
      } catch (error) {
        console.error("Error removing toggle upsell from cart:", error);
      }
    }
    function getUpsellImageSource(upsellProduct) {
      const upsellConfig = getUpsellConfig(upsellProduct);
      if (upsellConfig?.customImg) {
        return upsellConfig.customImg;
      }
      return upsellProduct.image;
    }
    function getUpsellSubtitle(upsellProduct) {
      const upsellConfig = getUpsellConfig(upsellProduct);
      if (upsellConfig?.subtitle) {
        return upsellConfig.subtitle;
      }
      return null;
    }
    async function handleToggleUpsellAddToCart(variantId) {
      if (isPreview() === true) {
        return;
      }
      try {
        const payload = {
          items: [
            {
              id: variantId.split("/").pop(),
              quantity: 1,
              properties: { _moonBundleCart: "toggleUpsell" }
            }
          ]
        };
        const response = await fetch("/cart/add.js?moonbundle_cart=true", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || "Failed to add to cart");
        }
        window.dispatchEvent(new CustomEvent("moonbundle-cart-updated"));
      } catch (error) {
        console.error("Error adding upsell to cart:", error);
      }
    }
    async function handleUpsellVariantChange(event, upsellProduct) {
      const target = event.target;
      const combination = target.value;
      if (!combination || !upsellProduct.optionsValuesEnriched) return null;
      try {
        const selectedOptions = parseCombination(combination, upsellProduct.optionsValuesEnriched);
        const newVariant = await fetchUpsellVariantByOptions(upsellProduct.productId, selectedOptions, get(country), get(locale), get(cartDrawerProps)?.storefrontToken || "", shop());
        if (newVariant) {
          return updateUpsellProductVariant(upsellProduct, newVariant);
        }
      } catch (error) {
        console.error("Error fetching upsell variant:", error);
      }
      return null;
    }
    function updateUpsellProductVariant(upsellProduct, newVariant) {
      if (!upsellProduct.productId) return null;
      const variantNumericId = parseInt(newVariant.id.split("/").pop() || "0", 10);
      const productIndex = get(upsellProductsData)?.findIndex((p) => p.productId === upsellProduct.productId) ?? -1;
      const baseProduct = productIndex >= 0 && get(upsellProductsData) ? get(upsellProductsData)[productIndex] : upsellProduct;
      const updatedProduct = {
        ...baseProduct,
        key: `${upsellProduct.productId}-${newVariant.id}`,
        variant_id: variantNumericId,
        original_line_price: Math.round(parseFloat(newVariant.price.amount) * 100),
        compare_at_price: newVariant.compareAtPrice ? Math.round(parseFloat(newVariant.compareAtPrice.amount) * 100) : void 0,
        image: newVariant.image?.transformedUrl || upsellProduct.image,
        options_with_values: newVariant.selectedOptions || upsellProduct.options_with_values,
        availableForSale: newVariant.availableForSale
      };
      if (productIndex >= 0 && get(upsellProductsData)) {
        const updatedUpsellProducts = [...get(upsellProductsData)];
        updatedUpsellProducts[productIndex] = updatedProduct;
        set(upsellProductsData, updatedUpsellProducts, true);
      }
      return updatedProduct;
    }
    function updateToggleUpsellProductData(toggleUpsellProductDataParams) {
      set(toggleUpsellProductData, toggleUpsellProductDataParams, true);
    }
    function updateShopMoneyFormat(format) {
      set(shopMoneyFormat, format, true);
    }
    function updateCountry(newCountry) {
      set(country, newCountry, true);
    }
    function updateCurrencyRate(rate) {
      const parsed = typeof rate === "string" ? parseFloat(rate) : rate;
      set(currencyRate, !isNaN(parsed) && isFinite(parsed) ? parsed : 1, true);
    }
    function generateOptionCombinations(optionsValuesEnriched) {
      if (!optionsValuesEnriched || optionsValuesEnriched.length === 0) {
        return [];
      }
      function combine(options, index2 = 0, current = []) {
        if (index2 >= options.length) {
          return [current.map((opt) => opt.value).join(", ")];
        }
        const results = [];
        const option = options[index2];
        for (const value of option.value) {
          const newCurrent = [...current, { name: option.name, value }];
          results.push(...combine(options, index2 + 1, newCurrent));
        }
        return results;
      }
      return combine(optionsValuesEnriched);
    }
    function getDefaultCombination(upsellProduct) {
      if (!upsellProduct.options_with_values || !upsellProduct.optionsValuesEnriched) {
        return "";
      }
      const currentCombination = upsellProduct.optionsValuesEnriched.map((enrichedOption) => {
        const currentValue = upsellProduct.options_with_values?.find((opt) => opt.name === enrichedOption.name)?.value;
        return currentValue || null;
      }).filter((part) => part !== null).join(", ");
      return currentCombination;
    }
    function parseCombination(combination, optionsValuesEnriched) {
      const selectedOptions = [];
      const values = combination.split(", ").map((v) => v.trim());
      optionsValuesEnriched.forEach((enrichedOption, index2) => {
        if (values[index2]) {
          selectedOptions.push({ name: enrichedOption.name, value: values[index2] });
        }
      });
      return selectedOptions;
    }
    function roundToTwoDecimals(value) {
      return Math.round(value * 100) / 100;
    }
    function isProgressBarGift(item) {
      if (!item.properties?._moonBundleCart || !get(cartDrawerProps)?.progressBar) {
        return false;
      }
      const segments = get(cartDrawerProps).progressBar.segmentsProgressBar || [];
      return segments.some((segment) => segment.id === item.properties?._moonBundleCart);
    }
    async function manageGiftProducts() {
      if (untrack(() => get(cartDisabled)) || !get(cart)) return;
      let itemsToAdd = [];
      let itemsToRemove = [];
      if (!get(cartDrawerProps)?.progressBar || !get(cartDrawerProps)?.progressBar?.isActive) {
        for (const item of get(cart).items) {
          const moonBundleCartProp = item.properties?._moonBundleCart;
          if (moonBundleCartProp && moonBundleCartProp !== "upsell" && moonBundleCartProp !== "toggleUpsell") {
            itemsToRemove.push(item.key);
          }
        }
        if (itemsToRemove.length > 0) {
          await performCartUpdates(itemsToAdd, itemsToRemove);
        }
        return;
      }
      const segments = get(cartDrawerProps)?.progressBar?.segmentsProgressBar || [];
      const unlockedType = get(cartDrawerProps)?.progressBar?.unlockedType || "cart total";
      const currentVal = unlockedType === "item count" ? get(itemCountWithoutGifts) : roundToTwoDecimals(get(totalForProgressBar) / 100);
      const validSegmentIds = new Set(segments.map((seg) => seg.id));
      const validVariantsBySegment = /* @__PURE__ */ new Map();
      for (const segment of segments) {
        if (segment.type !== "product-discount") continue;
        const gifts = segment.giftProductsProgressBar || [];
        const variantIds = /* @__PURE__ */ new Set();
        for (const gift of gifts) {
          if (gift.variantId) {
            const variantIdNumber = parseInt(gift.variantId.split("/").pop() || "0");
            if (variantIdNumber > 0) {
              variantIds.add(variantIdNumber);
            }
          }
        }
        validVariantsBySegment.set(segment.id, variantIds);
      }
      for (const item of get(cart).items) {
        const moonBundleCartProp = item.properties?._moonBundleCart;
        if (moonBundleCartProp && moonBundleCartProp !== "upsell" && moonBundleCartProp !== "toggleUpsell") {
          if (!validSegmentIds.has(moonBundleCartProp)) {
            itemsToRemove.push(item.key);
          } else {
            const validVariants = validVariantsBySegment.get(moonBundleCartProp);
            if (!validVariants || !validVariants.has(item.variant_id)) {
              itemsToRemove.push(item.key);
            }
          }
        }
      }
      for (const segment of segments) {
        if (segment.type !== "product-discount") continue;
        const thresholdInDisplayCurrency = unlockedType === "item count" ? segment.treshold : roundToTwoDecimals(segment.treshold * get(currencyRate));
        const isUnlocked = currentVal >= thresholdInDisplayCurrency;
        const gifts = segment.giftProductsProgressBar || [];
        for (const gift of gifts) {
          if (!gift.variantId) continue;
          const variantIdNumber = parseInt(gift.variantId.split("/").pop() || "0");
          const cartItem = get(cart).items.find((item) => item.variant_id === variantIdNumber && item.properties?._moonBundleCart === segment.id);
          if (isUnlocked) {
            const isGiftButtonActive = get(cartDrawerProps)?.progressBar?.isGiftButtonActive;
            const hasStorefrontToken = !!get(cartDrawerProps)?.storefrontToken;
            const avail = variantAvailabilityLookup(get(progressBarGiftVariantAvailability), gift.variantId);
            const storefrontSaysAvailable = !hasStorefrontToken || avail === true;
            if (!isGiftButtonActive && storefrontSaysAvailable && !cartItem) {
              itemsToAdd.push({
                id: variantIdNumber,
                quantity: gift.quantity || 1,
                properties: { _moonBundleCart: segment.id }
              });
            }
          } else {
            if (cartItem) {
              itemsToRemove.push(cartItem.key);
            }
          }
        }
      }
      if (itemsToAdd.length > 0 || itemsToRemove.length > 0) {
        await performCartUpdates(itemsToAdd, itemsToRemove);
      }
    }
    async function performCartUpdates(toAdd, toRemove) {
      set(cartDisabled, true);
      try {
        if (toAdd.length > 0) {
          const response = await fetch("/cart/add.js?moonbundle_cart=true", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({ items: toAdd })
          });
          if (!response.ok) {
            console.error("Failed to auto-add gift", response.status);
            return;
          }
        }
        if (toRemove.length > 0) {
          const updates = {};
          toRemove.forEach((key2) => {
            updates[key2] = 0;
          });
          const response = await fetch("/cart/update.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({ updates })
          });
          if (!response.ok) {
            console.error("Failed to remove gift");
          }
        }
        window.dispatchEvent(new CustomEvent("moonbundle-cart-updated"));
      } catch (error) {
        console.error("Error managing gifts:", error);
      } finally {
        set(cartDisabled, false);
      }
    }
    user_effect(() => {
      if (!get(cart) || !get(cartDrawerProps)?.progressBar?.isActive) return;
      get(progressBarGiftVariantAvailability);
      get(itemCountWithoutGifts);
      get(totalForProgressBar);
      void manageGiftProducts();
    });
    function verifyDiscounts() {
      if (!get(cart) || !get(cartDrawerProps)) {
        return;
      }
      manageGiftProducts();
    }
    var div = root();
    let classes;
    var div_1 = sibling(child(div), 2);
    var node = child(div_1);
    {
      let $0 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.headerCart?.textHeader);
      CartHeader(node, {
        get headerText() {
          return get($0);
        },
        get itemCount() {
          return get(itemCount);
        }
      });
    }
    var node_1 = sibling(node, 2);
    {
      var consequent = ($$anchor2) => {
        {
          let $0 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.timerCart?.isActive);
          let $1 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.progressBar?.isActive);
          let $2 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.upsellCart?.isActive);
          let $3 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.bodyCart?.bodyImage?.isActive);
          let $4 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.bodyCart?.bodyParagraph?.isActive);
          let $5 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.toggleUpsell?.isActive);
          let $6 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.footerCart?.isSubtotalActive);
          let $7 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.footerCart?.showDiscountLine);
          let $8 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.footerCart?.secondaryButton?.isActive);
          let $9 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.paymentIconsCart?.isActive);
          let $10 = /* @__PURE__ */ user_derived(() => get(cart)?.items?.length ?? 1);
          CartSkeleton($$anchor2, {
            get bodyPositions() {
              return get(bodyPositions);
            },
            get footerPositions() {
              return get(footerPositions);
            },
            get showTimer() {
              return get($0);
            },
            get showProgressBar() {
              return get($1);
            },
            get showUpsell() {
              return get($2);
            },
            get showBannerImage() {
              return get($3);
            },
            get showAdditionalText() {
              return get($4);
            },
            get showToggleUpsell() {
              return get($5);
            },
            get showSubtotal() {
              return get($6);
            },
            get showDiscountLine() {
              return get($7);
            },
            get showSecondaryButton() {
              return get($8);
            },
            get showPaymentMethods() {
              return get($9);
            },
            get itemCount() {
              return get($10);
            }
          });
        }
      };
      var alternate_7 = ($$anchor2) => {
        var fragment_1 = root_2();
        var div_2 = first_child(fragment_1);
        each(div_2, 21, () => get(bodyPositions), index, ($$anchor3, section) => {
          var fragment_2 = comment();
          var node_2 = first_child(fragment_2);
          {
            var consequent_1 = ($$anchor4) => {
              Timer($$anchor4, {
                get minutes() {
                  return get(cartDrawerProps).timerCart.minuts;
                },
                get text() {
                  return get(cartDrawerProps).timerCart.textTimer;
                },
                get isPreview() {
                  return isPreview();
                }
              });
            };
            var alternate_6 = ($$anchor4) => {
              var fragment_4 = comment();
              var node_3 = first_child(fragment_4);
              {
                var consequent_2 = ($$anchor5) => {
                  {
                    let $0 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps).progressBar?.preloadedGiftImages ?? {});
                    let $1 = /* @__PURE__ */ user_derived(() => get(locale) ?? null);
                    CartProgressBar($$anchor5, {
                      get progressBar() {
                        return get(cartDrawerProps).progressBar;
                      },
                      get cart() {
                        return get(cart);
                      },
                      get itemCountWithoutGifts() {
                        return get(itemCountWithoutGifts);
                      },
                      get totalForProgressBar() {
                        return get(totalForProgressBar);
                      },
                      shopifyFormatCurrency,
                      roundToTwoDecimals,
                      get currencyRate() {
                        return get(currencyRate);
                      },
                      get storefrontToken() {
                        return get(cartDrawerProps).storefrontToken;
                      },
                      get shop() {
                        return shop();
                      },
                      get preloadedGiftImages() {
                        return get($0);
                      },
                      get country() {
                        return get(country);
                      },
                      get locale() {
                        return get($1);
                      },
                      get variantAvailability() {
                        return get(progressBarGiftVariantAvailability);
                      },
                      set variantAvailability($$value) {
                        set(progressBarGiftVariantAvailability, $$value, true);
                      }
                    });
                  }
                };
                var alternate_5 = ($$anchor5) => {
                  var fragment_6 = comment();
                  var node_4 = first_child(fragment_6);
                  {
                    var consequent_3 = ($$anchor6) => {
                      CartBannerImage($$anchor6, {
                        get imageSrc() {
                          return get(cartDrawerProps).bodyCart.bodyImage.imageSrc;
                        }
                      });
                    };
                    var alternate_4 = ($$anchor6) => {
                      var fragment_8 = comment();
                      var node_5 = first_child(fragment_8);
                      {
                        var consequent_4 = ($$anchor7) => {
                          CartAdditionalText($$anchor7, {
                            get text() {
                              return get(cartDrawerProps).bodyCart.bodyParagraph.text;
                            }
                          });
                        };
                        var alternate_3 = ($$anchor7) => {
                          var fragment_10 = comment();
                          var node_6 = first_child(fragment_10);
                          {
                            var consequent_6 = ($$anchor8) => {
                              var fragment_11 = comment();
                              const sectionId = /* @__PURE__ */ user_derived(() => get(section).replace("customHtml-", ""));
                              const customHtmlSection = /* @__PURE__ */ user_derived(() => get(cartDrawerProps).bodyCart.customHtmlSections.find((c) => c.id === get(sectionId)));
                              var node_7 = first_child(fragment_11);
                              {
                                var consequent_5 = ($$anchor9) => {
                                  var div_3 = root_13();
                                  var node_8 = child(div_3);
                                  html(node_8, () => get(customHtmlSection).code);
                                  template_effect(() => {
                                    set_attribute(div_3, "data-section-id", get(customHtmlSection).id);
                                    set_attribute(div_3, "data-section-name", get(customHtmlSection).name);
                                  });
                                  append($$anchor9, div_3);
                                };
                                if_block(node_7, ($$render) => {
                                  if (get(customHtmlSection)?.code) $$render(consequent_5);
                                });
                              }
                              append($$anchor8, fragment_11);
                            };
                            var alternate_2 = ($$anchor8) => {
                              var fragment_12 = comment();
                              var node_9 = first_child(fragment_12);
                              {
                                var consequent_8 = ($$anchor9) => {
                                  var div_4 = root_15();
                                  var node_10 = child(div_4);
                                  {
                                    var consequent_7 = ($$anchor10) => {
                                      CartItems($$anchor10, {
                                        get filteredItems() {
                                          return get(filteredItems);
                                        },
                                        get cartDisabled() {
                                          return get(cartDisabled);
                                        },
                                        get cartDrawerProps() {
                                          return get(cartDrawerProps);
                                        },
                                        get loadingItems() {
                                          return get(loadingItems);
                                        },
                                        isProgressBarGift,
                                        shopifyFormatCurrency,
                                        getItemOriginalPrice,
                                        calculateItemDiscount,
                                        getSubtitleWithDiscount,
                                        get textDiscountSub() {
                                          return get(textDiscountSub);
                                        },
                                        get textDiscountOff() {
                                          return get(textDiscountOff);
                                        },
                                        get textFreeGift() {
                                          return get(textFreeGift);
                                        },
                                        handleSubscriptionToggle,
                                        handleSubscriptionChange
                                      });
                                    };
                                    var alternate = ($$anchor10) => {
                                      {
                                        let $0 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.emptyCart?.textEmptyCart);
                                        EmptyCart($$anchor10, {
                                          get emptyCartText() {
                                            return get($0);
                                          }
                                        });
                                      }
                                    };
                                    if_block(node_10, ($$render) => {
                                      if (get(cart) && get(filteredItems).length > 0) $$render(consequent_7);
                                      else $$render(alternate, false);
                                    });
                                  }
                                  append($$anchor9, div_4);
                                };
                                var alternate_1 = ($$anchor9) => {
                                  var fragment_15 = comment();
                                  var node_11 = first_child(fragment_15);
                                  {
                                    var consequent_9 = ($$anchor10) => {
                                      {
                                        let $0 = /* @__PURE__ */ user_derived(() => get(cartDrawerProps)?.upsellCart?.listUpsellIcons);
                                        CartUpsells($$anchor10, {
                                          get upsellProductsData() {
                                            return get(upsellProductsData);
                                          },
                                          get currentUpsellIndex() {
                                            return get(currentUpsellIndex);
                                          },
                                          get cart() {
                                            return get(cart);
                                          },
                                          get cartDrawerProps() {
                                            return get(cartDrawerProps);
                                          },
                                          get cartDisabled() {
                                            return get(cartDisabled);
                                          },
                                          get loadingUpsell() {
                                            return get(loadingUpsell);
                                          },
                                          shopifyFormatCurrency,
                                          getUpsellOriginalPrice,
                                          getUpsellFinalPrice,
                                          getUpsellDiscountAmount,
                                          formatDiscountDisplay,
                                          getUpsellImageSource,
                                          getUpsellSubtitle,
                                          generateOptionCombinations,
                                          getDefaultCombination,
                                          handleUpsellAddToCart,
                                          handleUpsellVariantChange,
                                          handleTouchStart,
                                          handleTouchMove,
                                          handleTouchEnd,
                                          nextUpsell,
                                          previousUpsell,
                                          ontotalchange: (count) => set(activeUpsellCount, count, true),
                                          get listUpsellIcons() {
                                            return get($0);
                                          },
                                          get currencyRate() {
                                            return get(currencyRate);
                                          },
                                          get isPreview() {
                                            return isPreview();
                                          },
                                          get shop() {
                                            return shop();
                                          },
                                          get locale() {
                                            return get(locale);
                                          },
                                          get country() {
                                            return get(country);
                                          }
                                        });
                                      }
                                    };
                                    if_block(
                                      node_11,
                                      ($$render) => {
                                        if (get(section) === "upsell" && get(cartDrawerProps)?.upsellCart?.isActive && get(itemCount) > 0 && (get(cartDrawerProps)?.upsellCart?.upsellMode === "ai" || get(upsellProductsData) && get(upsellProductsData).length > 0)) $$render(consequent_9);
                                      },
                                      true
                                    );
                                  }
                                  append($$anchor9, fragment_15);
                                };
                                if_block(
                                  node_9,
                                  ($$render) => {
                                    if (get(section) === "product") $$render(consequent_8);
                                    else $$render(alternate_1, false);
                                  },
                                  true
                                );
                              }
                              append($$anchor8, fragment_12);
                            };
                            if_block(
                              node_6,
                              ($$render) => {
                                if (get(section).startsWith("customHtml-") && get(cartDrawerProps)?.bodyCart?.customHtmlSections && get(itemCount) > 0) $$render(consequent_6);
                                else $$render(alternate_2, false);
                              },
                              true
                            );
                          }
                          append($$anchor7, fragment_10);
                        };
                        if_block(
                          node_5,
                          ($$render) => {
                            if (get(section) === "additionalText" && get(cartDrawerProps)?.bodyCart?.bodyParagraph?.isActive && get(itemCount) > 0) $$render(consequent_4);
                            else $$render(alternate_3, false);
                          },
                          true
                        );
                      }
                      append($$anchor6, fragment_8);
                    };
                    if_block(
                      node_4,
                      ($$render) => {
                        if (get(section) === "bannerImage" && get(cartDrawerProps)?.bodyCart?.bodyImage?.isActive && get(itemCount) > 0) $$render(consequent_3);
                        else $$render(alternate_4, false);
                      },
                      true
                    );
                  }
                  append($$anchor5, fragment_6);
                };
                if_block(
                  node_3,
                  ($$render) => {
                    if (get(section) === "progressBar" && get(cartDrawerProps)?.progressBar?.isActive && get(itemCount) > 0) $$render(consequent_2);
                    else $$render(alternate_5, false);
                  },
                  true
                );
              }
              append($$anchor4, fragment_4);
            };
            if_block(node_2, ($$render) => {
              if (get(section) === "timer" && get(cartDrawerProps)?.timerCart?.isActive && get(itemCount) > 0) $$render(consequent_1);
              else $$render(alternate_6, false);
            });
          }
          append($$anchor3, fragment_2);
        });
        var node_12 = sibling(div_2, 2);
        {
          let $0 = /* @__PURE__ */ user_derived(() => get(cart)?.discount_codes ?? []);
          CartFooter(node_12, {
            get footerPositions() {
              return get(footerPositions);
            },
            get cartDrawerProps() {
              return get(cartDrawerProps);
            },
            get itemCount() {
              return get(itemCount);
            },
            get toggleUpsellProductData() {
              return get(toggleUpsellProductData);
            },
            get toggleUpsellEnabled() {
              return get(toggleUpsellEnabled);
            },
            shopifyFormatCurrency,
            handleToggleUpsellAddToCart,
            handleToggleUpsellRemoveFromCart,
            get subtotalText() {
              return get(subtotalText);
            },
            get totalOriginalPriceIfCompareAtPrice() {
              return get(totalOriginalPriceIfCompareAtPrice);
            },
            get originalTotalPrice() {
              return get(originalTotalPrice);
            },
            get total() {
              return get(total);
            },
            get checkoutButtonText() {
              return get(checkoutButtonText);
            },
            get loadingCheckout() {
              return get(loadingCheckout);
            },
            handleCheckoutClick,
            handleSecondaryButtonClick,
            get textSaveDiscountSubtotal() {
              return get(textSaveDiscountSubtotal);
            },
            get textDiscountLineSubtotal() {
              return get(textDiscountLineSubtotal);
            },
            get discountBadges() {
              return get(discountBadges);
            },
            get discountInputPlaceholder() {
              return get(discountInputPlaceholder);
            },
            get discountInputButtonText() {
              return get(discountInputButtonText);
            },
            get discountInputErrorMessage() {
              return get(discountInputErrorMessage);
            },
            get cartDiscountCodes() {
              return get($0);
            },
            get isPreview() {
              return isPreview();
            },
            get acceleratedCheckoutHtml() {
              return acceleratedCheckoutHtml();
            }
          });
        }
        append($$anchor2, fragment_1);
      };
      if_block(node_1, ($$render) => {
        if (get(isCartLoading)) $$render(consequent);
        else $$render(alternate_7, false);
      });
    }
    template_effect(($0) => classes = set_class(div, 1, "moonbundle-cart-drawer", null, classes, $0), [() => ({ loading: get(cartDisabled) })]);
    append($$anchor, div);
    return pop({
      handleSubscriptionChange,
      handleSubscriptionToggle,
      updateCart,
      updateCartDrawerProps,
      updateGlobalCustom,
      updateLocale,
      updateShopMoneyFormat,
      updateCountry,
      enrichCartWithGraphqlDatas,
      get cart() {
        return get(cart);
      },
      set cart($$value) {
        set(cart, proxy($$value));
      },
      enableLoading,
      disableLoading,
      updateUpsellProducts,
      updateToggleUpsellProductData,
      updateCurrencyRate,
      verifyDiscounts,
      setCartLoading
    });
  }
  function createCartDrawer(target, props = {}) {
    if (!target) {
      throw new Error("Target is required for CartDrawer initialization");
    }
    const component = mount(CartDrawerMoon, {
      target,
      props
    });
    return component;
  }
  if (typeof window !== "undefined") {
    window.MoonbundleCartDrawer = createCartDrawer;
  }
  return createCartDrawer;
}();
