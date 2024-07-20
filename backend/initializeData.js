const { User, Poll, Question, Answer, Active_poll } = require("./models");
const bcrypt = require("bcryptjs");

const createUsers = async () => {
    const usersCount = await User.count();
    if (usersCount === 0) {
        const usersToInsert = [
            { user_name: "Sergei", email: "user1@example.com", password: await bcrypt.hash("password1", 5) },
            { user_name: "Pasha", email: "user2@example.com", password: await bcrypt.hash("password2", 5) },
            { user_name: "Oleg", email: "user3@example.com", password: await bcrypt.hash("password3", 5) },
        ];
        await User.bulkCreate(usersToInsert);
    }
};

const createPolls = async () => {
    const pollsCount = await Poll.count();
    if (pollsCount === 0) {
        const createdUsers = await User.findAll();
        const pollsToInsert = [
            {
                user_id: createdUsers[0].id,
                user_name: createdUsers[0].user_name,
                title: "Голосование за Культурную столицу 2026",
                description: "Описание опроса...",
                isOpen: true,
            },
            // Другие опросы...
        ];
        await Poll.bulkCreate(pollsToInsert);
    }
};

// Аналогично для других таблиц...

const initializeData = async () => {
    try {
        await createUsers();
        await createPolls();
        // Вызовите другие функции инициализации...
    } catch (error) {
        console.error("Error initializing data:", error);
    }
};

module.exports = { initializeData };