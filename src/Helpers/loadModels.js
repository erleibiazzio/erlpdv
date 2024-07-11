export async function loadModel(modelName) {
    try {
        const model = await import(`../models/${modelName}`);
        return model.default;
    } catch (error) {
        console.error(`Failed to load model ${modelName}:`, error);
        throw error;
    }
}
