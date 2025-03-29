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

-- таблица достижений
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

-- таблица пользовательских достижений
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  achievement_id BIGINT NOT NULL,

  UNIQUE (user_id, achievement_id),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) UNIQUE NOT NULL,
    reputation BIGINT DEFAULT 0,
    registration_date DATE NOT NULL,
    photo_id INTEGER DEFAULT 1,
    admin BOOLEAN DEFAULT FALSE,
    author BOOLEAN DEFAULT FALSE,
    description TEXT,
    activated BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE SET NULL
);

-- таблица всех курсов
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255)  NOT NULL,
    description TEXT,
    creator_id BIGINT NOT NULL,
    creation_date DATE NOT NULL,
    course_duration INTEGER NOT NULL,
    rating NUMERIC(3, 1) NOT NULL DEFAULT 0,
    reviews_count BIGINT DEFAULT 0,
    course_photo TEXT DEFAULT 'DefaultCoursePhoto.jpg',
    subscribers INTEGER DEFAULT 0,

    lessons_count INT DEFAULT 0,
    test_count INT DEFAULT 0,
    unlock_all BOOLEAN DEFAULT TRUE,

    difficulty_id BIGINT,
    
    FOREIGN KEY (difficulty_id) REFERENCES difficulties(id) ON DELETE SET NULL
);

-- таблица разделов
CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)  NOT NULL,
  UNIQUE (name , course_id ),
  course_id BIGINT NOT NULL,

  position INT NOT NULL,        -- Порядок секции
  -- is_unlocked BOOLEAN DEFAULT TRUE, в текущих условиях не нужна т.к. все вычисляем динамически, понадобится если вводить новые условия разблокировки секций 

  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
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
    name TEXT NOT NULL,
    is_test BOOLEAN NOT NULL,

    section_id BIGINT,
    
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

-- таблица курсов пользователя
CREATE TABLE IF NOT EXISTS user_courses (
    id SERIAL PRIMARY KEY,
    active BOOLEAN DEFAULT TRUE,

    user_id INT NOT NULL,
    course_id INT NOT NULL,

    progress INT DEFAULT 0,

    lessons_num_fin INT DEFAULT 0,

    UNIQUE (user_id, course_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- таблица пройденных уроков пользователя 
CREATE TABLE IF NOT EXISTS user_lessons (
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,

    PRIMARY KEY (user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE

);

-- таблица коментариев
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    rating INT CHECK (rating > 0 AND rating <= 5),
    content TEXT NOT NULL,
    user_nickname VARCHAR(255) NOT NULL,

    course_id INT NOT NULL,

    UNIQUE (user_nickname, course_id),
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- таблица секций пользователя
CREATE TABLE IF NOT EXISTS user_sections (
    user_id INT NOT NULL,
    section_id INT NOT NULL,
    is_unlocked BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,

    PRIMARY KEY (user_id, section_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

-- Супер пользователь для теста
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin1@mail.ru') THEN
    INSERT INTO users (email, password, nickname, name, surname, activated, registration_date) VALUES ('admin1@mail.ru', '$2b$10$qClaDFhQzCCFB4c6TkRxmecmGIXV75a2YO1Rf3cfRslY88zZnNieS', 'admin1', 'admin1', 'admin1', true, NOW());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin2@mail.ru') THEN
    INSERT INTO users (email, password, nickname, name, surname, activated, registration_date) VALUES ('admin2@mail.ru', '$2b$10$qClaDFhQzCCFB4c6TkRxmecmGIXV75a2YO1Rf3cfRslY88zZnNieS', 'admin2', 'admin2', 'admin2', true, NOW());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin3@mail.ru') THEN
    INSERT INTO users (email, password, nickname, name, surname, activated, registration_date) VALUES ('admin3@mail.ru', '$2b$10$qClaDFhQzCCFB4c6TkRxmecmGIXV75a2YO1Rf3cfRslY88zZnNieS', 'admin3', 'admin3', 'admin3', true, NOW());
  END IF;
END $$;

-- Функция для автоматического добавления и удаления счетчика уроков и тестов
CREATE OR REPLACE FUNCTION update_lessons_count()
RETURNS TRIGGER AS $$
DECLARE
    course_id_var INT;
BEGIN
    -- Определяем course_id в зависимости от типа операции
    IF TG_OP = 'INSERT' THEN
        SELECT s.course_id INTO course_id_var
        FROM sections s
        WHERE s.id = NEW.section_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- Если удаляем из lessons или sections, ищем course_id
        IF TG_TABLE_NAME = 'lessons' THEN
            SELECT s.course_id INTO course_id_var
            FROM sections s
            WHERE s.id = OLD.section_id;
        ELSIF TG_TABLE_NAME = 'sections' THEN
            course_id_var := OLD.course_id;
        END IF;
    END IF;

    -- Проверяем, что course_id определён
    IF course_id_var IS NULL THEN
        RETURN NULL;
    END IF;

    -- Обновляем lessons_count и test_count в таблице courses
    UPDATE courses
    SET 
        lessons_count = (
            SELECT COUNT(*)
            FROM lessons l
            JOIN sections s ON l.section_id = s.id
            WHERE s.course_id = courses.id AND is_test = FALSE
        ),
        test_count = (
            SELECT COUNT(*)
            FROM lessons l
            JOIN sections s ON l.section_id = s.id
            WHERE s.course_id = courses.id AND is_test = TRUE
        )
    WHERE id = course_id_var;

    -- Вызов функции пересчёта прогресса для всех пользователей курса
    PERFORM recalculate_all_user_progress(course_id_var);

    RETURN NULL; 
END;
$$ LANGUAGE plpgsql;


-- Триггер на обновления количества уроков и тестов в курсе
DROP TRIGGER IF EXISTS trg_update_lessons_count ON lessons;
CREATE TRIGGER trg_update_lessons_count
AFTER INSERT OR DELETE ON lessons
FOR EACH ROW
EXECUTE FUNCTION update_lessons_count();

-- Триггер для пересчёта уроков и тестов при удалении секции
DROP TRIGGER IF EXISTS trg_update_lessons_count_on_section_delete ON sections;
CREATE TRIGGER trg_update_lessons_count_on_section_delete
AFTER DELETE ON sections
FOR EACH ROW
EXECUTE FUNCTION update_lessons_count();

-- Триггерная функция для обновления прогресса при прохждениии урока ( добавления его id в таблицу user_lesson)
CREATE OR REPLACE FUNCTION update_user_progress()
RETURNS TRIGGER AS $$
DECLARE
    course_id_var INT;
    total_lessons_tests INT;
    completed_lessons_tests INT;
    target_user_id INT;
BEGIN
    -- Определяем user_id и course_id
    IF TG_OP = 'INSERT' THEN
        target_user_id := NEW.user_id;
        SELECT s.course_id, (c.lessons_count + c.test_count)
        INTO course_id_var, total_lessons_tests
        FROM lessons l
        JOIN sections s ON l.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        WHERE l.id = NEW.lesson_id;
    ELSIF TG_OP = 'DELETE' THEN
        target_user_id := OLD.user_id;
        SELECT s.course_id, (c.lessons_count + c.test_count)
        INTO course_id_var, total_lessons_tests
        FROM lessons l
        JOIN sections s ON l.section_id = s.id
        JOIN courses c ON s.course_id = c.id
        WHERE l.id = OLD.lesson_id;
    END IF;

    -- Проверяем, что course_id найден
    IF course_id_var IS NULL THEN
        RAISE NOTICE 'Course not found for lesson_id: %', OLD.lesson_id;
        RETURN NULL;
    END IF;

    -- Считаем количество пройденных уроков + тестов пользователя
    SELECT COUNT(*) INTO completed_lessons_tests
    FROM user_lessons ul
    JOIN lessons l ON ul.lesson_id = l.id
    JOIN sections s ON l.section_id = s.id
    WHERE ul.user_id = target_user_id
      AND s.course_id = course_id_var;

    -- Обновляем lessons_num_fin и progress
    UPDATE user_courses
    SET lessons_num_fin = completed_lessons_tests,
        progress = CASE
            WHEN total_lessons_tests > 0 THEN CEIL((completed_lessons_tests::DECIMAL / total_lessons_tests) * 100)
            ELSE 0
        END
    WHERE user_id = target_user_id
      AND course_id = course_id_var;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Триггер на добавление и удаление пройденных уроков 
DROP TRIGGER IF EXISTS trg_update_user_progress ON user_lessons;
CREATE TRIGGER trg_update_user_progress
AFTER INSERT OR DELETE ON user_lessons
FOR EACH ROW
EXECUTE FUNCTION update_user_progress();

-- Триггерная функция для пересчёта прогресса всех пользователей в курсе при изменении уроков или тестов курса
CREATE OR REPLACE FUNCTION recalculate_all_user_progress(course_id_var INT)
RETURNS VOID AS $$
DECLARE
    total_items INT;
BEGIN
    -- Определяем общее количество уроков и тестов в курсе
    SELECT (c.lessons_count + c.test_count) INTO total_items
    FROM courses c
    WHERE c.id = course_id_var;

    -- Массовое обновление прогресса для всех пользователей курса
    UPDATE user_courses uc
    SET lessons_num_fin = COALESCE(ul.completed_items, 0),
        progress = CASE
            WHEN total_items > 0 THEN CEIL(COALESCE(ul.completed_items, 0)::DECIMAL / total_items * 100)
            ELSE 0
        END
    FROM (
        -- Считаем количество завершённых уроков для каждого пользователя
        SELECT ul.user_id, COUNT(*) AS completed_items
        FROM user_lessons ul
        JOIN lessons l ON ul.lesson_id = l.id
        JOIN sections s ON l.section_id = s.id
        WHERE s.course_id = course_id_var
        GROUP BY ul.user_id

        -- Включаем пользователей без завершённых уроков (прогресс = 0)
        UNION All
        SELECT uc.user_id, 0 AS completed_items
        FROM user_courses uc
        WHERE uc.course_id = course_id_var
        AND NOT EXISTS (
            SELECT 1 FROM user_lessons ul
            JOIN lessons l ON ul.lesson_id = l.id
            JOIN sections s ON l.section_id = s.id
            WHERE ul.user_id = uc.user_id
            AND s.course_id = course_id_var
        )
        
    ) ul
    WHERE uc.user_id = ul.user_id
      AND uc.course_id = course_id_var;

END;
$$ LANGUAGE plpgsql;


-- функция удаления всех пройденных уроков при отписке от курса 
CREATE OR REPLACE FUNCTION delete_user_lessons_on_course_remove()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM user_lessons
    WHERE user_id = OLD.user_id
      AND lesson_id IN (
          SELECT l.id
          FROM lessons l
          JOIN sections s ON l.section_id = s.id
          WHERE s.course_id = OLD.course_id
      );
    
    DELETE FROM user_sections
    WHERE user_id = OLD.user_id
      AND section_id IN (
          SELECT id
          FROM sections
          WHERE course_id = OLD.course_id
      );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Триггер для удаления всех пройденных уроков при отписке от курса 
DROP TRIGGER IF EXISTS trg_delete_user_lessons_on_course_remove ON user_courses;
CREATE TRIGGER trg_delete_user_lessons_on_course_remove
AFTER DELETE ON user_courses
FOR EACH ROW
EXECUTE FUNCTION delete_user_lessons_on_course_remove();

-- Триггерная функция для обновления количества подписчиков у курса 
CREATE OR REPLACE FUNCTION update_course_subscribers()
RETURNS TRIGGER AS $$
BEGIN
    -- Обновляем количество подписчиков: +1 при INSERT, -1 при DELETE
    UPDATE courses
    SET subscribers = subscribers + CASE TG_OP
        WHEN 'INSERT' THEN 1
        WHEN 'DELETE' THEN -1
        ELSE 0
    END
    WHERE id = COALESCE(NEW.course_id, OLD.course_id);

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Триггер на добавлени нового курса в таблицу user_courses
DROP TRIGGER IF EXISTS trg_update_course_subscribers ON user_courses;
CREATE TRIGGER trg_update_course_subscribers
AFTER INSERT OR DELETE ON user_courses
FOR EACH ROW
EXECUTE FUNCTION update_course_subscribers();

-- Функция для проверки завершения секции и разблокировки следующей
CREATE OR REPLACE FUNCTION check_and_unlock_next_section()
RETURNS TRIGGER AS $$
DECLARE
    current_section_id INT;
    next_section_id INT;
    course_id_var INT;
    unlock_type_var BOOLEAN;
BEGIN
    -- Определяем текущую секцию и курс
    SELECT l.section_id, s.course_id, c.unlock_all INTO current_section_id, course_id_var, unlock_type_var
    FROM lessons l
    JOIN sections s ON l.section_id = s.id
    JOIN courses c ON s.course_id = c.id
    WHERE l.id = NEW.lesson_id;


    -- Проверяем, все ли уроки в текущей секции завершены
    IF NOT EXISTS (
        SELECT 1
        FROM lessons l
        LEFT JOIN user_lessons ul ON l.id = ul.lesson_id AND ul.user_id = NEW.user_id
        WHERE l.section_id = current_section_id AND (ul.lesson_id IS NULL)
    ) THEN
        -- Отмечаем секцию как завершенную
        UPDATE user_sections
        SET is_completed = TRUE
        WHERE user_id = NEW.user_id AND section_id = current_section_id;



        -- Находим следующую секцию
        SELECT id INTO next_section_id
        FROM sections
        WHERE course_id = course_id_var
          AND  id > current_section_id           --position = (SELECT position + 1 FROM sections WHERE id = current_section_id)
        LIMIT 1;

        -- Разблокируем следующую секцию
        IF next_section_id IS NOT NULL THEN
            INSERT INTO user_sections (user_id, section_id, is_unlocked)
            VALUES (NEW.user_id, next_section_id, TRUE)
            ON CONFLICT (user_id, section_id) DO UPDATE
            SET is_unlocked = TRUE;
        END IF;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Триггер на проверку и разблокировку секции
DROP TRIGGER IF EXISTS trg_check_and_unlock_next_section ON user_lessons;
CREATE TRIGGER trg_check_and_unlock_next_section
AFTER INSERT ON user_lessons
FOR EACH ROW
EXECUTE FUNCTION check_and_unlock_next_section();


-- Функция для автоматической разблокировки всех секций при подписке
CREATE OR REPLACE FUNCTION unlock_all_sections_on_subscription()
RETURNS TRIGGER AS $$
DECLARE
    first_section_id INT;
BEGIN
    -- Если курс настроен на автоматическую разблокировку всех секций
    IF (SELECT unlock_all FROM courses WHERE id = NEW.course_id) = TRUE THEN
        INSERT INTO user_sections (user_id, section_id, is_unlocked)
        SELECT NEW.user_id, s.id, TRUE
        FROM sections s
        WHERE s.course_id = NEW.course_id
        ON CONFLICT (user_id, section_id) DO UPDATE
        SET is_unlocked = TRUE;
    ELSE
        -- Найти первую секцию (где position = 0) для курса
        SELECT id INTO first_section_id
        FROM sections
        WHERE course_id = NEW.course_id AND position = 0
        ORDER BY id ASC
        LIMIT 1;

        -- Разблокировать первую секцию, если найдена
        IF first_section_id IS NOT NULL THEN
            INSERT INTO user_sections (user_id, section_id, is_unlocked)
            VALUES (NEW.user_id, first_section_id, TRUE)
            ON CONFLICT (user_id, section_id) DO UPDATE
            SET is_unlocked = TRUE;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Триггер для автоматической разблокировки всех секций при подписке
DROP TRIGGER IF EXISTS trg_unlock_sections_on_subscription ON user_courses;
CREATE TRIGGER trg_unlock_sections_on_subscription
AFTER INSERT ON user_courses
FOR EACH ROW
EXECUTE FUNCTION unlock_all_sections_on_subscription();
