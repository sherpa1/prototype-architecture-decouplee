const { Model } = require('objection');
const slugify = require('slugify');

const dbConfig = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    charset: 'utf8'
  }
};

const knex = require('knex')(dbConfig);

Model.knex(knex);

class User extends Model {
  static tableName = "users";

  static get relationMappings() {
    return {
      posts:{
        relation:Model.HasManyRelation,
        modelClass:Post,
        join:{
          from:'user.uuid',
          to:'posts.user_uuid'
        }
      }
    }
  }

}

class Post extends Model {
  static tableName = "posts";

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    await this.create_slug();
  }

  async create_slug(){
    this.slug = slugify(this.title);
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join:{
          from:'posts.user_uuid',
          to:'users.uuid'
        }
      }
    }
  }
}

class Tag extends Model {
  static tableName = "tags";

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    await this.create_slug();
  }

  async create_slug(){
    this.slug = slugify(this.title);
  }

  static get relationMappings() {
    return {
      posts: {
        relation: Model.ManyToManyRelation,
        modelClass: Post,
        join: {
          from: 'tags.id',
          through: {
            from: 'post_tags.tag_id',
            to: 'post_tags.post_uuid',
          },
          to: 'post.uuid'
        }
      }
    }
  }
}

module.exports = { User, Post, Tag, knex };