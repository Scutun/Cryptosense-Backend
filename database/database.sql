-- таблица словарь с уровнями сложности курса
CREATE TABLE IF NOT EXISTS difficulties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- таблица словарь с тегами для курсов
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- таблица словарь фотографий
CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) UNIQUE NOT NULL,
    perutation BIGINT DEFAULT 0,
    registration_date DATE NOT NULL,
    photo_id INTEGER DEFAULT 1,
    admin BOOLEAN DEFAULT FALSE,
    activated BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE SET NULL
);

-- таблица всех курсов
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    creator_id BIGINT NOT NULL,
    creation_date DATE NOT NULL,
    course_duration TEXT,

    difficulty_id BIGINT,
    tag_id BIGINT,
    
    FOREIGN KEY (difficulty_id) REFERENCES difficulties(id) ON DELETE SET NULL,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE SET NULL
);

-- таблица уроков курса
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    photo TEXT,
    graphics TEXT,
    videos TEXT,

    course_id BIGINT,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- таблица курсов пользователя
CREATE TABLE IF NOT EXISTS user_courses (
    id SERIAL PRIMARY KEY,
    active BOOLEAN DEFAULT TRUE,

    user_id INT NOT NULL,
    course_id INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- таблица коментариев
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    rating INT,
    content TEXT NOT NULL,
    user_nickname VARCHAR(255) NOT NULL,

    course_id INT NOT NULL,

    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);