import App from "../app";

interface InsertValues {
    key: string;
    value: any;
}

interface QueryCondition {
    key: string;
    value: string;
}

abstract class BaseModel {
    protected app: App;
    abstract baseName: string;
    abstract structure: string[];

    constructor(app: App) {
        this.app = app;
    }

    protected async get(type: "all" | "first" | "last", conditions?: QueryCondition[]) {
        let query = `SELECT ${this.structure.map(c => `\`${c}\``).join(", ")} FROM \`${this.baseName}\``;
        if (conditions) {
            query += " WHERE ";
            query += conditions.map(c => `\`${c.key}\` = '${c.value}'`).join(" AND ");
        }

        let req: any[] = await this.app.database.query(query);
        switch (type) {
            case "all": return req;
            case "first": return req.length > 0 ? req[0] : null;
            case "last": return req.length > 0 ? req[req.length - 1] : null;
        }
    }

    protected async insert(insertValues: InsertValues[]): Promise<number> {
        let attributesToSet = [];
        for (let structure of this.structure)
            for (let insertValue of insertValues)
                if (structure.includes(insertValue.key))
                    attributesToSet.push("`" + structure + "`");

        let values = [];
        for (let insertValue of insertValues)
            values.push(`"${insertValue.value}"`);

        let query = `INSERT INTO \`${this.baseName}\`(${attributesToSet.join(", ")}) VALUES (${values.join(", ")})`;
        let result = await this.app.database.query(query);

        return result.insertId;
    }

    abstract find(type: "all", conditions?: QueryCondition[]): Promise<any[]>;
    abstract find(type: "first" | "last", conditions?: QueryCondition[]): Promise<any>;
    abstract find(type: "all" | "first" | "last", conditions?: QueryCondition[]): Promise<any[]> | Promise<any>;
    abstract create(insertValues: any): Promise<number>;
    abstract toObject(data: any): any;
}

export {
    QueryCondition,
    InsertValues,
    BaseModel,
}