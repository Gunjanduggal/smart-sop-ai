const analyzeInventoryCommand = async (command) => {
    const normalized = command.trim().toLowerCase();
    const fromToMatch = normalized.match(/^(increase|decrease|set|update)\s+(.+?)\s+(?:inventory|stock)\s+from\s+(\d+)\s+to\s+(\d+)$/i);
    const amountMatch = normalized.match(/^(increase|decrease)\s+(.+?)\s+(?:inventory|stock)\s+by\s+(\d+)$/i);
    const setMatch = normalized.match(/^(set|update)\s+(.+?)\s+(?:inventory|stock)\s+to\s+(\d+)$/i);

    if (fromToMatch) {
        const [, rawAction, productName, oldQuantity, newQuantity] = fromToMatch;
        return {
            action: rawAction === 'set' || rawAction === 'update' ? 'set' : rawAction,
            mode: 'set',
            productName: productName.trim(),
            statedOldQuantity: Number(oldQuantity),
            requestedQuantity: Number(newQuantity)
        };
    }

    if (amountMatch) {
        const [, action, productName, amount] = amountMatch;
        return {
            action,
            mode: 'delta',
            productName: productName.trim(),
            requestedQuantity: Number(amount)
        };
    }

    if (setMatch) {
        const [, , productName, amount] = setMatch;
        return {
            action: 'set',
            mode: 'set',
            productName: productName.trim(),
            requestedQuantity: Number(amount)
        };
    }

    return {
        action: '',
        mode: '',
        productName: '',
        requestedQuantity: 0
    };
};

module.exports = { analyzeInventoryCommand };
