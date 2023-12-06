class UnauthorizedError extends Error {
    constructor(message = 'Permission denied!') {
        super(message);
        this.name = 'unauthorized';
    }
}

module.export = { UnauthorizedError };
