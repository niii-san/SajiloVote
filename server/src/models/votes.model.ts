import {
    DataTypes,
    Model,
    InferAttributes,
    CreationOptional,
    InferCreationAttributes,
} from "@sequelize/core";
import {
    Attribute,
    NotNull,
    PrimaryKey,
    AutoIncrement,
    Table,
} from "@sequelize/core/decorators-legacy";

/*
 * Votes candidate table
 * This is table for candidates options in Event type "vote"
 */

@Table({ underscored: true, tableName: "vote_candidates", timestamps: false })
export class VoteCandidate extends Model<
    InferAttributes<VoteCandidate>,
    InferCreationAttributes<VoteCandidate>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare vote_candidate_id: CreationOptional<number>;

    // foreign key, belgons to which event
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare event_id: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare candidate_name: string;

    @Attribute(DataTypes.STRING)
    declare candidate_email: CreationOptional<string | null>;
}

/*
 * poll_options table
 * This table is for poll options in Event type "poll"
 */

@Table({ underscored: true, tableName: "poll_options", timestamps: false })
export class PollOption extends Model<
    InferAttributes<PollOption>,
    InferCreationAttributes<PollOption>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare poll_option_id: CreationOptional<number>;

    // foreign key, belgons to which event
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare event_id: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare option_text: string;
}

/*
 * vote_records table
 * this table is for tracking votes,
 * who voted in which event for which option
 */

@Table({ underscored: true, tableName: "vote_records", timestamps: false })
export class VoteRecord extends Model<
    InferAttributes<PollOption>,
    InferCreationAttributes<PollOption>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare record_id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare event_id: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare voter_id: number;

    @Attribute(DataTypes.STRING)
    declare voted_candidate_id: CreationOptional<string>;

    @Attribute(DataTypes.STRING)
    declare voted_option_id: CreationOptional<string>;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare voted_at: Date;
}
