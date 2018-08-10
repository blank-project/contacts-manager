<!-- A Vue Mixin to deal with Permissions. -->
<template></template>
<script>
// START authorization.js from express-authorization, rewritten.
var permissions = { };
permissions['compilePart'] = function(part) {
  var special = "\\^$*+?.()|{}[]";
  var exp = [];
  for (var i = 0; i < part.length; ++i) {
    var c = part.charAt(i);
    if (c == '?') {
      exp.push("[^:]");
    } else if (c == '*') {
      exp.push("[^:]*");
    } else {
      if (special.indexOf(c) >= 0) {
        exp.push("\\");
      }
      exp.push(c);
    }
  }
  return exp.join("");
};

permissions['coalescePermissions'] = function() {
  var permissions = [], i;
  for (i=0; i < arguments.length; i++) {
    if (arguments[i] != null && arguments[i] != undefined){
      permissions = permissions.concat(arguments[i]);
    }
  }
  return permissions;
};

permissions['compilePermission'] = function(permission) {
  var compilePart = this.compilePart;
  permission = permission.replace(/(\:\*)+$/, "");
  return permission.split(":").map(function (part) {
    var list = part.split(",").map(function (part) {
      return compilePart(part);
    });
    switch (list.length) {
      case 0: return "";
      case 1: return list[0];
      default: return "(" + list.join("|") + ")";
    }
  }).join(":");
};

permissions['compileClaim'] = function() {
  var permissions = this.coalescePermissions.apply(null, arguments);
  if (permissions.length == 0) return new RegExp("$false^");
  var statements = [];
  for (var i=0; i<permissions.length; i++){
    statements.push(this.compilePermission(permissions[i]));
  }
  var result = statements.join("|");
  if (statements.length > 1) result = "(" + result + ")";
  return new RegExp("^" + result + "(\\:.*)*$");
};

permissions['considerPermissions'] = function() {
  var claim = this.compileClaim.apply(null, arguments), coalesce = this.coalescePermissions;
  return {
    isPermitted : function() {
      var permissions = coalesce.apply(null, arguments);
      if (permissions.length == 0) return false;
      for (var i=0; i<permissions.length; i++) {
        if (!claim.test(permissions[i])) return false;
      }
      return true;
    }
  }

  Object.defineProperty(claim, "isPermitted", { value: this.isPermitted });
  return claim;
};

permissions['considerSubject'] = function considerSubject(subject) {
  var permissions = [];
  if (subject && subject.permissions) permissions = subject.permissions;
  return this.considerPermissions(permissions);
};

permissions['checkPermissions'] = function(/*user , permissions... */) {
  if (arguments.length <= 1) {
    return true;
  }
  var user, permissions;
  [user, ...permissions] = arguments;
  if (!user) {
    return false;
  }
  return this.considerSubject(user).isPermitted(permissions);
  //return true;
};

// END authorization.js from express-authorization.
export default {
  methods : permissions
};
</script>
<style></style>
