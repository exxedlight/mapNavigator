import { runModifyQuery, runQuery } from "@/db/query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
    try {
        await runModifyQuery(`DROP TABLE IF EXISTS 
            Records, 
            Requests, 
            Users`
        );

        await runModifyQuery(`
          CREATE TABLE Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            login VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            role TINYINT NOT NULL
          )
        `);

        await runModifyQuery(`
          CREATE TABLE Requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            StartLat DOUBLE NOT NULL,
            StartLng DOUBLE NOT NULL,
            EndLat DOUBLE NOT NULL,
            EndLng DOUBLE NOT NULL,
            timestamp DATETIME NOT NULL,
            status TINYINT NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            FOREIGN KEY (userId) REFERENCES Users(id)
          )
        `);

        await runModifyQuery(`
          CREATE TABLE Records (
            id INT AUTO_INCREMENT PRIMARY KEY,
            driverId INT NOT NULL,
            requestId INT NOT NULL,
            FOREIGN KEY (driverId) REFERENCES Users(id),
            FOREIGN KEY (requestId) REFERENCES Requests(id)
          )
        `);

        return NextResponse.json({ message: 'Database reset and tables created.' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database reset failed.' });
    }
}