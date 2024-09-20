async function determineUserRole(email) {
    const adminEmails = ['admin@ecommerce.com','admin2@ecommerce.com'];
    const role = adminEmails.includes(email) ? 'admin' : 'user';
    return role;
}

module.exports = determineUserRole;