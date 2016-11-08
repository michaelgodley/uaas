const mongoose = require('mongoose'),
      Acl = require('acl'),
      log = require('../appconfig/logger');

log.trace({mod: 'acl'}, 'Initializing ACL DB');
const acl = new Acl(new Acl.mongodbBackend(mongoose.connection.db, 'acl_'));
log.trace({mod: 'acl'}, 'Initializing ACL Roles');
acl.allow([
    {
	roles: 'admin',
	allows : [
	    {resources: 'secret', permissions: 'get' },
	    {resources: 'topsecret', permissions: '*'} 
	]
    },
    {
	roles: 'user',
	allows: [
	    {resources: 'secret', permissions: 'post'}
	]
    },
    {
	roles: 'guest',
	allows: [
	    {resources: 'public', permissions: 'get'}
	]
    }
]);

log.trace({mod: 'acl'}, 'Initializing ACL Role Parents');
acl.addUserRoles('joe', 'admin');
acl.addUserRoles('john', 'guest');
acl.addUserRoles('jane', 'user');

acl.addRoleParents('user', 'guest');
acl.addRoleParents('admin', 'user');


acl.isAllowed('joe', 'topsecret', 'get', function(err, res) {
    log.debug({mod: 'acl'}, `topsecret get Is Allowed for Joe is ${res} ${err}`);
});
acl.isAllowed('joe', 'secret', 'get', function(err, res) {
    log.debug({mod: 'acl'}, `secret get Is Allowed for joe is ${res} ${err}`);
});
acl.isAllowed('joe', 'secret', 'post', function(err, res) {
    log.debug({mod: 'acl'}, `secret post Is Allowed for joe is ${res} ${err}`);
});
acl.isAllowed('joe', 'public', 'get', function(err, res) {
    log.debug({mod: 'acl'}, `public get Is Allowed for joe is ${res} ${err}`);
});

acl.isAllowed('jane', 'topsecret', 'get', function(err, res) {
    log.debug({mod: 'acl'}, `topsecret get Is Allowed for Jane is ${res} ${err}`);
});
acl.isAllowed('jane', 'secret', 'post', function(err, res) {
    log.debug({mod: 'acl'}, `secret post Is Allowed for Jane is ${res} ${err}`);
});
acl.isAllowed('jane', 'public', 'get', function(err, res) {
    log.debug({mod: 'acl'}, `public get Is Allowed for Jane is ${res} ${err}`);
});


acl.allowedPermissions('joe', ['topsecret', 'secret', 'public'], function(err, permissions) {
    log.debug({mod: 'acl'},`Allowed Permissions for Joe: ${permissions.topsecret} ${permissions.secret} ${permissions.public}` );
});

acl.allowedPermissions('jane', ['topsecret', 'secret', 'public'], function(err, permissions) {
    log.debug({mod: 'acl'},`Allowed Permissions for Jane: ${permissions.topsecret} ${permissions.secret} ${permissions.public}` );
});

acl.allowedPermissions('john', ['topsecret', 'secret', 'public'], function(err, permissions) {
    log.debug({mod: 'acl'},`Allowed Permissions for John: ${permissions.topsecret} ${permissions.secret} ${permissions.public}` );
});

