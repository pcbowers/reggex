---
"reggex": minor
---

Add transformer plugin to pre-compile a Reggex into a RegExp to completely remove any performance overhead that is added by this library

Note: This assumes that the `compileReggex()` function is used instead of the `.compile()` method and that the function passed to `compileReggex` does not have any side-effects. If the function passed to `compileReggex` has side-effects, it will be left as-is since `reggex` is completely functional at run-time.
