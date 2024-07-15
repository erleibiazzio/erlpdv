import User from './User';

async function descriptions() {
    return {
        user: await User.describe()
    }
}

export { descriptions };
