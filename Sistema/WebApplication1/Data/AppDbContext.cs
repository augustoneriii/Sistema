using System;
using System.Data;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace app.Data
{
    public class AppDbContext
    {
        private readonly string _connectionString;
        public NpgsqlConnection _connection;
        private NpgsqlTransaction _transaction;

        public AppDbContext(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            _connection = new NpgsqlConnection(connectionString);
        }

        public void OpenConnection()
        {
            if (_connection.State != ConnectionState.Open)
            {
                _connection.Open();
            }
        }

        public void BeginTransaction()
        {
            if (_connection.State != ConnectionState.Open)
                _connection.Open();

            _transaction = _connection.BeginTransaction();
        }

        public void Commit()
        {
            _transaction?.Commit();
            CloseConnection();
        }

        public bool TransactionIsActive()
        {
            return _transaction != null && _transaction.Connection != null;
        }

        public void Rollback()
        {
            if (_transaction != null && _transaction.Connection != null)
            {
                _transaction.Rollback();
            }
            CloseConnection();
        }

        public void CloseConnection()
        {
            if (_connection.State != ConnectionState.Closed)
                _connection.Close();
        }

        public DataTable ExecuteQuery(string sql)
        {
            OpenConnection();  // Ensure connection is open
            using (var cmd = new NpgsqlCommand(sql, _connection, _transaction))
            {
                using (var reader = cmd.ExecuteReader())
                {
                    var result = new DataTable();
                    result.Load(reader);
                    return result;
                }
            }
        }

        public int ExecuteNonQuery(string sql)
        {
            OpenConnection();  // Ensure connection is open
            using (var cmd = new NpgsqlCommand(sql, _connection, _transaction))
            {
                return cmd.ExecuteNonQuery();
            }
        }
    }
}
