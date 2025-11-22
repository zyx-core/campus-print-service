export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN');
};
