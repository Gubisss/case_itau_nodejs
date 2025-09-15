class TransactionQueue {
    constructor() {
        this.isProcessing = false;
        this.queue = [];
    }

    async enqueue(operation) {
        return new Promise((resolve, reject) => {
            const task = async () => {
                try {
                    const result = await operation();
                    resolve(result);
                } catch (error) {
                    reject(error);
                } finally {
                    this.isProcessing = false;
                    this.processNext();
                }
            };

            this.queue.push(task);

            if (!this.isProcessing) {
                this.processNext();
            }
        });
    }

    processNext() {
        if (this.queue.length > 0 && !this.isProcessing) {
            this.isProcessing = true;
            const nextTask = this.queue.shift();
            nextTask();
        }
    }
}

module.exports = new TransactionQueue();