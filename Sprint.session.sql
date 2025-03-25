
CREATE TABLE t_User (
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
    c_activatedon TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE t_Instructor (
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
    c_status VARCHAR(30),
    c_idproof VARCHAR(100),
    c_activationtoken VARCHAR(150),
    c_activatedon TIMESTAMP WITHOUT TIME ZONE
);



CREATE TABLE t_Class (
    c_classid SERIAL PRIMARY KEY,
    c_classname VARCHAR(100),
    c_instructorid INT REFERENCES t_Instructor(c_instructorid) ON DELETE CASCADE,
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

CREATE TABLE t_Bookings (
    c_bookingid SERIAL PRIMARY KEY,
    c_userid INT REFERENCES t_User(c_userID) ON DELETE CASCADE,
    c_classid INT REFERENCES t_Class(c_classid) ON DELETE CASCADE,
    c_createdat TIMESTAMP WITHOUT TIME ZONE,
    c_paymentstatus VARCHAR(20)
);

CREATE TABLE t_reset_password (
    c_resetid SERIAL PRIMARY KEY,
    c_userid INT NOT NULL,
    c_otp INT NOT NULL,
    c_expiry_at TIMESTAMP, 
    c_role VARCHAR(100) NOT NULL,
    c_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);