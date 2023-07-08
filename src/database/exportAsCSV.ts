export const exportAsCSV = `
    BEGIN TRANSACTION;
        .header on

        .mode csv

        .output Employee.csv

        SELECT * FROM clients;

        .quit
    COMMIT;
`;
