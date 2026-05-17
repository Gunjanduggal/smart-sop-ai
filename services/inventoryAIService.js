const analyzeInventoryCommand = async (command) => {

    command = command.toLowerCase();

    let action = '';
    let productName = '';
    let oldQuantity = 0;
    let newQuantity = 0;

    // DETECT ACTION
    if (command.includes('increase')) {
        action = 'increase';
    }

    if (command.includes('decrease')) {
        action = 'decrease';
    }

    // DETECT PRODUCT
    if (command.includes('laptop')) {
        productName = 'Laptop';
    }

    // EXTRACT NUMBERS
    const numbers = command.match(/\d+/g);

    if (numbers && numbers.length >= 2) {

        oldQuantity = parseInt(numbers[0]);

        newQuantity = parseInt(numbers[1]);
    }

    return {
        action,
        productName,
        oldQuantity,
        newQuantity
    };
};

module.exports = {
    analyzeInventoryCommand
};