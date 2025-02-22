import {
    DataTypes,
    Model,
    InferAttributes,
    CreationOptional,
    InferCreationAttributes,
    NonAttribute,
} from "@sequelize/core";
import {
    Attribute,
    NotNull,
    PrimaryKey,
    AutoIncrement,
    Table,
    HasMany,
    CreatedAt,
    UpdatedAt,
    BelongsTo,
} from "@sequelize/core/decorators-legacy";
import {
    EventParticipant,
    PollOption,
    VoteCandidate,
    VoteRecord,
} from "./votes.model.js";
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

    @Attribute(DataTypes.ENUM(["poll", "vote"]))
    @NotNull
    declare type: "poll" | "vote";

    @Attribute(DataTypes.DATE)
    declare start_at: Date | null;

    @Attribute(DataTypes.DATE)
    declare end_at: Date | null;

    @Attribute(DataTypes.ENUM(["immediate", "manual", "date"]))
    @NotNull
    declare start_type: "immediate" | "manual" | "date" | string;

    // Foreign key
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare user_id: number;

    @CreatedAt
    declare created_at: CreationOptional<Date>;

    @UpdatedAt
    declare updated_at: CreationOptional<Date>;

    // one event has many vote records, i.e which user voted to which poll_option/vote_candidate
    @HasMany(() => VoteRecord, {
        foreignKey: {
            name: "event_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    })
    declare vote_records?: NonAttribute<VoteRecord[]>;

    // one event can have many candidates if the event type is "vote"
    @HasMany(() => VoteCandidate, {
        foreignKey: {
            name: "event_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    })
    declare vote_candidates?: NonAttribute<VoteCandidate[]>;

    // one event can have many poll options if the event type is "poll"
    @HasMany(() => PollOption, {
        foreignKey: {
            name: "event_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    })
    declare poll_options?: NonAttribute<PollOption[]>;

    // one event can have many participants
    @HasMany(() => EventParticipant, {
        foreignKey: {
            name: "event_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    })
    declare event_participants?: NonAttribute<EventParticipant[]>;

    @BelongsTo(() => User, "user_id")
    declare creator?: NonAttribute<User>;
}
