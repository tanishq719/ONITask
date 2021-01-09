CREATE DATABASE myfeedapp

CREATE TABLE nuser(
    email_id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR(250)
);

CREATE TABLE post(
    post_id SERIAL PRIMARY KEY,
    post_body VARCHAR(800),
    post_images TEXT[],
    post_vedios TEXT[],
    email_id VARCHAR(50),
    FOREIGN KEY(email_id) REFERENCES nuser(email_id)
);