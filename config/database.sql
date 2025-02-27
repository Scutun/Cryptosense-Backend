-- таблица словарь с уровнями сложности курса
CREATE TABLE IF NOT EXISTS difficulties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Запись сдложности курсов
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM difficulties WHERE name = 'Легкая') THEN
    INSERT INTO difficulties (name) VALUES ('Легкая');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM difficulties WHERE name = 'Средняя') THEN
    INSERT INTO difficulties (name) VALUES ('Средняя');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM difficulties WHERE name = 'Сложная') THEN
    INSERT INTO difficulties (name) VALUES ('Сложная');
  END IF;

END $$;

-- таблица словарь с тегами для курсов
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Запись названий тегов курсов
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Bitcoin') THEN
    INSERT INTO tags (name) VALUES ('Bitcoin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Ethereum') THEN
    INSERT INTO tags (name) VALUES ('Ethereum');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Litecoin') THEN
    INSERT INTO tags (name) VALUES ('Litecoin');
  END IF;
END $$;

-- таблица словарь фотографий
CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Запись названий аватаров
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM photos WHERE name = 'cristalAvatar.jpg') THEN
    INSERT INTO photos (name) VALUES ('cristalAvatar.jpg');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM photos WHERE name = 'bitcoinPlusAvatar.jpg') THEN
    INSERT INTO photos (name) VALUES ('bitcoinPlusAvatar.jpg');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM photos WHERE name = 'bitpandaAvatar.jpg') THEN
    INSERT INTO photos (name) VALUES ('bitpandaAvatar.jpg');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM photos WHERE name = 'cDollarAvatar.jpg') THEN
    INSERT INTO photos (name) VALUES ('cDollarAvatar.jpg');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM photos WHERE name = 'rightsAvatar.jpg') THEN
    INSERT INTO photos (name) VALUES ('rightsAvatar.jpg');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM photos WHERE name = 'synthetixAvatar.jpg') THEN
    INSERT INTO photos (name) VALUES ('synthetixAvatar.jpg');
  END IF;
END $$;

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
    course_duration INTEGER NOT NULL,
    rating NUMERIC(3, 1) NOT NULL DEFAULT 5.0,
    course_photo TEXT,
    subscribers INTEGER DEFAULT 0,

    difficulty_id BIGINT,
    
    FOREIGN KEY (difficulty_id) REFERENCES difficulties(id) ON DELETE SET NULL
);

-- Промежуточная таблица для связи курсов и тегов
CREATE TABLE IF NOT EXISTS course_tags (
    id SERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
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

    UNIQUE (user_id, course_id)

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

    UNIQUE (user_nickname, course_id)
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);