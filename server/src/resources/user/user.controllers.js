import { User } from './user.model';

const createUser = async (req, res) => {
    const { email, password } = req.body;
    const user = new User({ email, password });
    user.save(err => {
        if (err) {
            res.status(500).send({ message: "Error registering new user." }).end();
        } else {
            res.status(200).send({ message: 'User is registered' });
        }
    })
}

export const controllers = {
    createUser: createUser
}