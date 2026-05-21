class DataBase {
  static #maria = null
  #pool = null
  #poolPromise = null
  #host = null
  #port = null
  #user = null
  #password = null
  #database = null

  connect(host, user, password, database, port = 3306) {
    this.#host = host
    this.#port = port
    this.#user = user
    this.#password = password
    this.#database = database
    return this
  }

  async disconnect() {
    if (this.#pool) await this.#pool.end()
    this.#pool = null
    this.#poolPromise = null
    this.#host = null
    this.#port = null
    this.#user = null
    this.#password = null
    this.#database = null
  }

  insert(nom_table, attributs) {
    const table = this.#id(nom_table)
    const pairs = Array.isArray(attributs) ? attributs : []
    if (pairs.length === 0) throw new Error("attributs requis")
    const now = this.#now()
    pairs.push(["createdAt", now], ["updatedAt", now])
    const cols = pairs.map(p => p[0])
    const params = pairs.map(p => p[1])
    cols.forEach(c => this.#id(c))
    const placeholders = params.map(() => "?").join(", ")
    const sql = `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders})`
    return this.#run(sql, params).then(res => !!(res && ((res.affectedRows | 0) > 0 || res.insertId !== undefined)))
  }

  select(nom_table, attributs, condition_attributs) {
    const table = this.#id(nom_table)
    const cols = Array.isArray(attributs) && attributs.length ? attributs : ["*"]
    cols.filter(c => c !== "*").forEach(c => this.#id(c))
    const where = this.#where(condition_attributs)
    const sql = `SELECT ${cols.join(", ")} FROM ${table}${where.sql}`
    return this.#all(sql, where.params)
  }

  delete(nom_table, condition_attributs) {
    const table = this.#id(nom_table)
    const where = this.#where(condition_attributs)
    if (where.params.length === 0) throw new Error("condition requise")
    const sql = `DELETE FROM ${table}${where.sql}`
    return this.#run(sql, where.params).then(res => !!(res && (res.affectedRows | 0) > 0))
  }

  update(nom_table, attributs, condition_attributs) {
    const table = this.#id(nom_table)
    const pairs = Array.isArray(attributs) ? attributs : []
    if (pairs.length === 0) throw new Error("attributs requis")
    pairs.push(["updatedAt", this.#now()])
    const where = this.#where(condition_attributs)
    if (where.params.length === 0) throw new Error("condition requise")
    const cols = pairs.map(([c]) => { this.#id(c); return `${c} = ?` })
    const params = [...pairs.map(([, v]) => v), ...where.params]
    const sql = `UPDATE ${table} SET ${cols.join(", ")}${where.sql}`
    return this.#run(sql, params).then(res => !!(res && (res.affectedRows | 0) > 0))
  }

  #now() {
    return new Date().toISOString().slice(0, 19).replace("T", " ")
  }

  #id(name) {
    if (typeof name !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(name))
      throw new Error("identifiant invalide")
    return name
  }

  #where(conditions) {
    const list = Array.isArray(conditions) ? conditions : []
    if (list.length === 0) return { sql: "", params: [] }
    const clauses = []
    const params = []
    for (const [col, val] of list) {
      this.#id(col)
      clauses.push(`${col} = ?`)
      params.push(val)
    }
    return { sql: ` WHERE ${clauses.join(" AND ")}`, params }
  }

  #run(sql, params) {
    return this.#ensurePool().then(pool =>
      pool.query(sql, params).then(res => ({
        insertId: res.insertId,
        affectedRows: res.affectedRows
      }))
    )
  }

  #all(sql, params) {
    return this.#ensurePool().then(pool => pool.query(sql, params))
  }

  #ensurePool() {
    if (this.#pool) return Promise.resolve(this.#pool)
    if (this.#poolPromise) return this.#poolPromise
    this.#poolPromise = this.#createPool().then(pool => {
      this.#pool = pool
      return pool
    }).catch(err => {
      this.#poolPromise = null
      throw err
    })
    return this.#poolPromise
  }

  async #createPool() {
    if (!DataBase.#maria)
      DataBase.#maria = await import('mariadb').then(m => m.default || m)
    return DataBase.#maria.createPool({
      host: this.#host,
      port: this.#port,
      user: this.#user,
      password: this.#password,
      database: this.#database,
      connectionLimit: 5
    })
  }
}

module.exports = DataBase