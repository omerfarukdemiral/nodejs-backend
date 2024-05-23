/**
 * seeder.js
 * @description :: functions that seeds mock data to run the application
 */

const bcrypt = require('bcrypt');
const Wallet = require('../model/wallet');
const authConstant = require('../constants/authConstant');
const Role = require('../model/role');
const ProjectRoute = require('../model/projectRoute');
const RouteRole = require('../model/routeRole');
const UserRole = require('../model/userRole');
const { replaceAll } = require('../utils/common');
const dbService = require('../utils/dbService');

/* seeds default users */
async function seedUser () {
  try {
    let userToBeInserted = {};
    userToBeInserted = {
      'password':'QpPCXqEiR8eGjOj',
      'isDeleted':false,
      'walletAddress':'zw5ltxhucz',
      'isActive':true,
      'userType':authConstant.USER_TYPES.User
    };
    userToBeInserted.password = await  bcrypt.hash(userToBeInserted.password, 8);
    let user = await dbService.updateOne(Wallet, { 'walletAddress':'zw5ltxhucz' }, userToBeInserted,  { upsert: true });
    userToBeInserted = {
      'password':'H97DmukSybXgJTz',
      'isDeleted':false,
      'walletAddress':'lw420flpfs',
      'isActive':true,
      'userType':authConstant.USER_TYPES.Admin
    };
    userToBeInserted.password = await  bcrypt.hash(userToBeInserted.password, 8);
    let admin = await dbService.updateOne(Wallet, { 'walletAddress':'lw420flpfs' }, userToBeInserted,  { upsert: true });
    console.info('Users seeded 🍺');
  } catch (error){
    console.log('User seeder failed due to ', error.message);
  }
}
/* seeds roles */
async function seedRole () {
  try {
    const roles = [ 'Admin', 'Seller', 'System_User', 'Customer' ];
    const insertedRoles = await dbService.findMany(Role, { code: { '$in': roles.map(role => role.toUpperCase()) } });
    const rolesToInsert = [];
    roles.forEach(role => {
      if (!insertedRoles.find(insertedRole => insertedRole.code === role.toUpperCase())) {
        rolesToInsert.push({
          name: role,
          code: role.toUpperCase(),
          weight: 1
        });
      }
    });
    if (rolesToInsert.length) {
      const result = await dbService.create(Role, rolesToInsert);
      if (result) console.log('Role seeded 🍺');
      else console.log('Role seeder failed!');
    } else {
      console.log('Role is upto date 🍺');
    }
  } catch (error) {
    console.log('Role seeder failed due to ', error.message);
  }
}

/* seeds routes of project */
async function seedProjectRoutes (routes) {
  try {
    if (routes  && routes.length) {
      let routeName = '';
      const dbRoutes = await dbService.findMany(ProjectRoute, {});
      let routeArr = [];
      let routeObj = {};
      routes.forEach(route => {
        routeName = `${replaceAll((route.path).toLowerCase(), '/', '_')}`;
        route.methods.forEach(method => {
          routeObj = dbRoutes.find(dbRoute => dbRoute.route_name === routeName && dbRoute.method === method);
          if (!routeObj) {
            routeArr.push({
              'uri': route.path.toLowerCase(),
              'method': method,
              'route_name': routeName,
            });
          }
        });
      });
      if (routeArr.length) {
        const result = await dbService.create(ProjectRoute, routeArr);
        if (result) console.info('ProjectRoute model seeded 🍺');
        else console.info('ProjectRoute seeder failed.');
      } else {
        console.info('ProjectRoute is upto date 🍺');
      }
    }
  } catch (error) {
    console.log('ProjectRoute seeder failed due to ', error.message);
  }
}

/* seeds role for routes */
async function seedRouteRole () {
  try {
    const routeRoles = [ 
      {
        route: '/admin/assetcategory/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/assetcategory/create',
        role: 'Seller',
        method: 'POST'
      },
      {
        route: '/admin/assetcategory/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/assetcategory/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/admin/assetcategory/addbulk',
        role: 'Seller',
        method: 'POST'
      },
      {
        route: '/admin/assetcategory/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/assetcategory/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/assetcategory/list',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/assetcategory/list',
        role: 'Customer',
        method: 'POST'
      },
      {
        route: '/admin/assetcategory/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/assetcategory/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/assetcategory/:id',
        role: 'Seller',
        method: 'GET' 
      },
      {
        route: '/admin/assetcategory/:id',
        role: 'Customer',
        method: 'GET' 
      },
      {
        route: '/admin/assetcategory/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/admin/assetcategory/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/assetcategory/count',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/assetcategory/count',
        role: 'Customer',
        method: 'POST'
      },
      {
        route: '/admin/assetcategory/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/assetcategory/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/update/:id',
        role: 'Seller',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/partial-update/:id',
        role: 'Seller',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/updatebulk',
        role: 'Seller',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/assetcategory/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/admin/assetcategory/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/assetcategory/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/admin/assetcategory/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/order/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/order/create',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/order/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/order/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/order/addbulk',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/order/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/order/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/order/list',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/order/list',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/order/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/order/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/order/:id',
        role: 'Seller',
        method: 'GET' 
      },
      {
        route: '/admin/order/:id',
        role: 'Customer',
        method: 'GET' 
      },
      {
        route: '/admin/order/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/order/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/order/count',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/order/count',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/order/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/order/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/order/update/:id',
        role: 'Seller',
        method: 'PUT' 
      },
      {
        route: '/admin/order/update/:id',
        role: 'Customer',
        method: 'PUT' 
      },
      {
        route: '/admin/order/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/order/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/order/partial-update/:id',
        role: 'Seller',
        method: 'PUT'
      },
      {
        route: '/admin/order/partial-update/:id',
        role: 'Customer',
        method: 'PUT'
      },
      {
        route: '/admin/order/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/order/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/order/updatebulk',
        role: 'Seller',
        method: 'PUT' 
      },
      {
        route: '/admin/order/updatebulk',
        role: 'Customer',
        method: 'PUT' 
      },
      {
        route: '/admin/order/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/order/softdelete/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/order/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/order/softdeletemany',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/order/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/order/delete/:id',
        role: 'Admin',
        method: 'DELETE' 
      },
      {
        route: '/admin/order/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/order/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/order/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/asset/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/asset/create',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/asset/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/asset/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/asset/addbulk',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/asset/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/asset/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/asset/list',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/asset/list',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/asset/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/asset/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/asset/:id',
        role: 'Seller',
        method: 'GET' 
      },
      {
        route: '/admin/asset/:id',
        role: 'Customer',
        method: 'GET' 
      },
      {
        route: '/admin/asset/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/asset/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/asset/count',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/asset/count',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/asset/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/asset/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/asset/update/:id',
        role: 'Seller',
        method: 'PUT' 
      },
      {
        route: '/admin/asset/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/asset/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/asset/partial-update/:id',
        role: 'Seller',
        method: 'PUT'
      },
      {
        route: '/admin/asset/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/asset/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/asset/updatebulk',
        role: 'Seller',
        method: 'PUT' 
      },
      {
        route: '/admin/asset/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/asset/softdelete/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/asset/softdelete/:id',
        role: 'Seller',
        method: 'PUT' 
      },
      {
        route: '/admin/asset/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/asset/softdeletemany',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/asset/softdeletemany',
        role: 'Seller',
        method: 'PUT' 
      },
      {
        route: '/admin/asset/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/asset/delete/:id',
        role: 'Admin',
        method: 'DELETE' 
      },
      {
        route: '/admin/asset/delete/:id',
        role: 'Seller',
        method: 'DELETE' 
      },
      {
        route: '/admin/asset/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/asset/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/asset/deletemany',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/asset/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/state/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/state/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/state/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/state/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/state/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/state/list',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/state/list',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/state/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/state/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/state/:id',
        role: 'Seller',
        method: 'GET' 
      },
      {
        route: '/admin/state/:id',
        role: 'Customer',
        method: 'GET' 
      },
      {
        route: '/admin/state/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/state/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/state/count',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/state/count',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/state/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/state/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/state/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/state/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/state/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/state/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/state/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/state/softdelete/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/state/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/state/softdeletemany',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/state/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/state/delete/:id',
        role: 'Admin',
        method: 'DELETE' 
      },
      {
        route: '/admin/state/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/state/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/state/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/user/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/create',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/user/create',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/user/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/addbulk',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/user/addbulk',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/user/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/user/:id',
        role: 'Seller',
        method: 'GET' 
      },
      {
        route: '/admin/user/:id',
        role: 'Customer',
        method: 'GET' 
      },
      {
        route: '/admin/user/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/user/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/count',
        role: 'Seller',
        method: 'POST' 
      },
      {
        route: '/admin/user/count',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/user/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'Seller',
        method: 'PUT' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'Customer',
        method: 'PUT' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'Seller',
        method: 'PUT'
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'Customer',
        method: 'PUT'
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/user/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/updatebulk',
        role: 'Seller',
        method: 'PUT' 
      },
      {
        route: '/admin/user/updatebulk',
        role: 'Customer',
        method: 'PUT' 
      },
      {
        route: '/admin/user/updatebulk',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/user/delete/:id',
        role: 'Admin',
        method: 'DELETE' 
      },
      {
        route: '/admin/user/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/user/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/wallet/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/create',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/addbulk',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/list',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/wallet/:id',
        role: 'Customer',
        method: 'GET' 
      },
      {
        route: '/admin/wallet/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/wallet/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/count',
        role: 'Customer',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/wallet/update/:id',
        role: 'Customer',
        method: 'PUT' 
      },
      {
        route: '/admin/wallet/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/wallet/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/wallet/partial-update/:id',
        role: 'Customer',
        method: 'PUT'
      },
      {
        route: '/admin/wallet/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/wallet/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/wallet/updatebulk',
        role: 'Customer',
        method: 'PUT' 
      },
      {
        route: '/admin/wallet/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/wallet/softdelete/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/wallet/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/wallet/softdeletemany',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/wallet/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/wallet/delete/:id',
        role: 'Admin',
        method: 'DELETE' 
      },
      {
        route: '/admin/wallet/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/wallet/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/wallet/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/create',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/create',
        role: 'Customer',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/addbulk',
        role: 'Customer',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/list',
        role: 'Customer',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/wallettransaction/:id',
        role: 'Customer',
        method: 'GET'
      },
      {
        route: '/admin/wallettransaction/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/admin/wallettransaction/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/count',
        role: 'Customer',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/wallettransaction/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/wallettransaction/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/wallettransaction/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/wallettransaction/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/wallettransaction/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/wallettransaction/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/wallettransaction/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/wallettransaction/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/wallettransaction/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/wallettransaction/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/admin/wallettransaction/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/wallettransaction/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/admin/wallettransaction/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/auth/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/auth/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/auth/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/auth/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/auth/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/auth/update/:id',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/auth/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/auth/updatebulk',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/auth/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/auth/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/auth/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/auth/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/earnings/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/earnings/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/earnings/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/earnings/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/earnings/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/earnings/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/earnings/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/earnings/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/earnings/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/earnings/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/earnings/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/earnings/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/admin/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/admin/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/admin/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/admin/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/admin/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/admin/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/admin/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/admin/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/admin/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/admin/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/admin/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/admin/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/usertokens/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/usertokens/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/activitylog/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/activitylog/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/activitylog/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/activitylog/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/activitylog/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/activitylog/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/activitylog/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/activitylog/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/activitylog/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/activitylog/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/activitylog/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/activitylog/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/role/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/role/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/update/:id',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/role/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/updatebulk',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/role/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/role/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/admin/projectroute/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/projectroute/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/routerole/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/routerole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/routerole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/userrole/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/userrole/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/userrole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/userrole/deletemany',
        role: 'System_User',
        method: 'POST'
      },

    ];
    if (routeRoles && routeRoles.length) {
      const routes = [...new Set(routeRoles.map(routeRole => routeRole.route.toLowerCase()))];
      const routeMethods = [...new Set(routeRoles.map(routeRole => routeRole.method))];
      const roles = [ 'Admin', 'Seller', 'System_User', 'Customer' ];
      const insertedProjectRoute = await dbService.findMany(ProjectRoute, {
        uri: { '$in': routes },
        method: { '$in': routeMethods },
        'isActive': true,
        'isDeleted': false
      });
      const insertedRoles = await dbService.findMany(Role, {
        code: { '$in': roles.map(role => role.toUpperCase()) },
        'isActive': true,
        'isDeleted': false
      });
      let projectRouteId = '';
      let roleId = '';
      let createRouteRoles = routeRoles.map(routeRole => {
        projectRouteId = insertedProjectRoute.find(pr => pr.uri === routeRole.route.toLowerCase() && pr.method === routeRole.method);
        roleId = insertedRoles.find(r => r.code === routeRole.role.toUpperCase());
        if (projectRouteId && roleId) {
          return {
            roleId: roleId.id,
            routeId: projectRouteId.id
          };
        }
      });
      createRouteRoles = createRouteRoles.filter(Boolean);
      const routeRolesToBeInserted = [];
      let routeRoleObj = {};

      await Promise.all(
        createRouteRoles.map(async routeRole => {
          routeRoleObj = await dbService.findOne(RouteRole, {
            routeId: routeRole.routeId,
            roleId: routeRole.roleId,
          });
          if (!routeRoleObj) {
            routeRolesToBeInserted.push({
              routeId: routeRole.routeId,
              roleId: routeRole.roleId,
            });
          }
        })
      );
      if (routeRolesToBeInserted.length) {
        const result = await dbService.create(RouteRole, routeRolesToBeInserted);
        if (result) console.log('RouteRole seeded 🍺');
        else console.log('RouteRole seeder failed!');
      } else {
        console.log('RouteRole is upto date 🍺');
      }
    }
  } catch (error){
    console.log('RouteRole seeder failed due to ', error.message);
  }
}

/* seeds roles for users */
async function seedUserRole (){
  try {
    const userRoles = [{
      'walletAddress':'zw5ltxhucz',
      'password':'QpPCXqEiR8eGjOj'
    },{
      'walletAddress':'lw420flpfs',
      'password':'H97DmukSybXgJTz'
    }];
    const defaultRoles = await dbService.findMany(Role);
    const insertedUsers = await dbService.findMany(User, { username: { '$in': userRoles.map(userRole => userRole.username) } });
    let user = {};
    const userRolesArr = [];
    userRoles.map(userRole => {
      user = insertedUsers.find(user => user.username === userRole.username && user.isPasswordMatch(userRole.password) && user.isActive && !user.isDeleted);
      if (user) {
        if (user.userType === authConstant.USER_TYPES.Admin){
          userRolesArr.push({
            userId: user.id,
            roleId: defaultRoles.find((d)=>d.code === 'ADMIN')._id
          });
        } else if (user.userType === authConstant.USER_TYPES.User){
          userRolesArr.push({
            userId: user.id,
            roleId: defaultRoles.find((d)=>d.code === 'USER')._id
          });
        } else {
          userRolesArr.push({
            userId: user.id,
            roleId: defaultRoles.find((d)=>d.code === 'SYSTEM_USER')._id
          });
        }  
      }
    });
    let userRoleObj = {};
    const userRolesToBeInserted = [];
    if (userRolesArr.length) {
      await Promise.all(
        userRolesArr.map(async userRole => {
          userRoleObj = await dbService.findOne(UserRole, {
            userId: userRole.userId,
            roleId: userRole.roleId
          });
          if (!userRoleObj) {
            userRolesToBeInserted.push({
              userId: userRole.userId,
              roleId: userRole.roleId
            });
          }
        })
      );
      if (userRolesToBeInserted.length) {
        const result = await dbService.create(UserRole, userRolesToBeInserted);
        if (result) console.log('UserRole seeded 🍺');
        else console.log('UserRole seeder failed');
      } else {
        console.log('UserRole is upto date 🍺');
      }
    }
  } catch (error) {
    console.log('UserRole seeder failed due to ', error.message);
  }
}

async function seedData (allRegisterRoutes){
  await seedUser();
  await seedRole();
  await seedProjectRoutes(allRegisterRoutes);
  await seedRouteRole();
  await seedUserRole();

};
module.exports = seedData;