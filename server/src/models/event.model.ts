import {
    DataTypes,
    Model,
    InferAttributes,
    CreationOptional,
    NonAttribute,
    InferCreationAttributes,
} from "@sequelize/core";
import {
    Attribute,
    NotNull,
    PrimaryKey,
    AutoIncrement,
    // CreatedAt,
    // UpdatedAt,
    Table,
    BelongsTo,
} from "@sequelize/core/decorators-legacy";
import { User } from "./user.model.js";

@Table({ underscored: true })
export class Event extends Model<
    InferAttributes<Event>,
    InferCreationAttributes<Event>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare event_id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare title: string;

    @Attribute(DataTypes.TEXT)
    declare description: CreationOptional<string>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare type: "poll" | "vote";

    @Attribute(DataTypes.DATE)
    @NotNull
    declare start_at: Date;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare end_at: Date;

    // Foreign key
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare creator_id: number;
}
