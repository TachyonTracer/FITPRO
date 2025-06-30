-- User and instructor tables
CREATE TABLE IF NOT EXISTS t_user (
    c_userid SERIAL PRIMARY KEY,
    c_username VARCHAR(100),
    c_email VARCHAR(100) UNIQUE,
    c_password VARCHAR(300),
    c_mobile VARCHAR(100),
    c_gender VARCHAR(100),
    c_dob DATE,
    c_height INT,
    c_weight DECIMAL(10,2),
    c_goal TEXT, 
    c_medicalcondition TEXT,
    c_profileimage TEXT,
    c_createdat TIMESTAMP WITHOUT TIME ZONE,
    c_status BOOLEAN DEFAULT FALSE,
    c_activationtoken VARCHAR(150),
    c_activatedon TIMESTAMP WITHOUT TIME ZONE,
    c_balance DECIMAL(10,2) DEFAULT 0.00,
    c_reason VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS t_instructor (
    c_instructorid SERIAL PRIMARY KEY,
    c_instructorname VARCHAR(100),
    c_email VARCHAR(100) UNIQUE,
    c_password VARCHAR(300),
    c_mobile VARCHAR(100),
    c_gender VARCHAR(100),
    c_dob DATE,
    c_specialization TEXT,
    c_certificates JSON,
    c_profileimage TEXT,
    c_association TEXT,
    c_createdat TIMESTAMP WITHOUT TIME ZONE,
    c_status VARCHAR(30) DEFAULT 'Unverified',
    c_idproof VARCHAR(100),
    c_activationtoken VARCHAR(150),
    c_activatedon TIMESTAMP WITHOUT TIME ZONE,
    c_reason VARCHAR(500)
);

-- Class and booking tables
CREATE TABLE IF NOT EXISTS t_class (
    c_classid SERIAL PRIMARY KEY,
    c_classname VARCHAR(100),
    c_instructorid INT REFERENCES t_instructor(c_instructorid) ON DELETE CASCADE,
    c_description JSON,
    c_type TEXT,
    c_startdate DATE,
    c_enddate DATE,
    c_starttime TIME,
    c_endtime TIME,
    c_duration INT,
    c_maxcapacity INT,
    c_availablecapacity INT,
    c_requiredequipments TEXT,
    c_createdat TIMESTAMP WITHOUT TIME ZONE,
    c_status TEXT,
    c_city TEXT,
    c_address TEXT,
    c_assets JSON,
    c_fees DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS t_bookings (
    c_bookingid SERIAL PRIMARY KEY,
    c_userid INT REFERENCES t_user(c_userid) ON DELETE CASCADE,
    c_classid INT REFERENCES t_class(c_classid) ON DELETE CASCADE,
    c_createdat TIMESTAMP WITHOUT TIME ZONE,
    c_waitlist INT DEFAULT 0
);

-- Password reset and attendance
CREATE TABLE IF NOT EXISTS t_reset_password (
    c_resetid SERIAL PRIMARY KEY,
    c_userid INT NOT NULL,
    c_otp INT NOT NULL,
    c_expiry_at TIMESTAMP, 
    c_role VARCHAR(100) NOT NULL,
    c_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    c_isused BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS t_attendance (
    c_attendanceid SERIAL PRIMARY KEY,
    c_classid INT REFERENCES t_class(c_classid),
    c_attendancedate DATE NOT NULL,
    c_presentstudents INT[] NOT NULL,
    c_absentstudents INT[] NOT NULL
);

-- Blog tables
CREATE TABLE IF NOT EXISTS t_blogpost (
    c_blog_id SERIAL PRIMARY KEY,
    c_blog_author_id INT NOT NULL,
    c_tags TEXT,
    c_title TEXT NOT NULL,
    c_desc TEXT,
    c_content TEXT, -- base64 encoded
    c_thumbnail TEXT,
    c_created_at BIGINT NOT NULL,
    c_published_at BIGINT,
    c_is_published BOOLEAN DEFAULT FALSE,
    c_views INT DEFAULT 0,
    c_likes INT DEFAULT 0,
    c_comments INT DEFAULT 0,
    c_source_url TEXT
);

CREATE TABLE IF NOT EXISTS t_blog_likes (
    c_like_id SERIAL PRIMARY KEY,
    c_blog_id INT NOT NULL REFERENCES t_blogpost(c_blog_id) ON DELETE CASCADE,
    c_user_id INT NOT NULL,
    c_liked_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS t_blog_bookmark (
    c_bookmark_id SERIAL PRIMARY KEY,
    c_blog_id INT NOT NULL REFERENCES t_blogpost(c_blog_id) ON DELETE CASCADE,
    c_user_id INT NOT NULL,
    c_bookmarked_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS t_blog_comment (
    c_comment_id SERIAL PRIMARY KEY,
    c_blog_id INT NOT NULL REFERENCES t_blogpost(c_blog_id) ON DELETE CASCADE,
    c_user_id INT NOT NULL,
    c_commented_at BIGINT NOT NULL,
    c_comment_content TEXT NOT NULL,
    c_parent_comment_id INT,
    c_user_role TEXT
);

-- Feedback tables
CREATE TABLE IF NOT EXISTS t_feedback_instructor (
    c_feedbackid SERIAL PRIMARY KEY,
    c_userid INT,
    c_instructorid INT,
    c_feedback TEXT,
    c_rating INT,
    c_createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_feedback_class (
    c_feedbackid SERIAL PRIMARY KEY,
    c_userid INT,
    c_classid INT,
    c_feedback TEXT,
    c_rating INT,
    c_createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallet transactions
CREATE TABLE IF NOT EXISTS t_wallet_transactions (
    c_transactionid SERIAL PRIMARY KEY,
    c_userid INT REFERENCES t_user(c_userid),
    c_amount DECIMAL(10, 2) NOT NULL,
    c_type VARCHAR(20) NOT NULL,
    c_description VARCHAR(255),
    c_timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

-- Sample feedback data
INSERT INTO t_feedback_instructor (c_userid, c_instructorid, c_feedback, c_rating, c_createdat) VALUES
(34, 5, 'Instructor Raj explained every step clearly. Bahut achha laga!', 5, '2025-04-09 10:15:00'),
(41, 2, 'Neha ma''am was very professional and helpful.', 4, '2025-04-09 11:00:00');

INSERT INTO t_feedback_class (c_userid, c_classid, c_feedback, c_rating, c_createdat) VALUES
(34, 45, 'Yoga class tha shaandar! Energy full day ke liye mil gayi.', 5, '2025-04-09 09:45:00'),
(41, 46, 'Zumba class was good but thoda loud music tha.', 3, '2025-04-09 10:30:00');