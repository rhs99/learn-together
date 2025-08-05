# Winston Logging Setup Documentation

## Overview

This project uses Winston for comprehensive logging with daily rotating files. The logging system provides different log levels, file rotation, and structured logging for better debugging and monitoring.

## Features

- **Daily Log Rotation**: Automatically creates new log files daily and removes old ones
- **Multiple Log Levels**: error, warn, info, http, debug
- **Structured Logging**: JSON format for better parsing and analysis
- **Separate Log Files**: Different files for errors, HTTP requests, and combined logs
- **Console Logging**: Colored output for development
- **File Compression**: Old log files are automatically compressed

## Log Files Structure

```
lt-server/logs/
├── error-2025-08-05.log      # Error logs only
├── combined-2025-08-05.log   # All logs
├── http-2025-08-05.log       # HTTP request logs
├── error-2025-08-04.log.gz   # Compressed old files
└── ...
```

## Log Levels

- **error**: System errors, exceptions, critical issues
- **warn**: Warning conditions, client errors (4xx), security events
- **info**: General information, business events, authentication
- **http**: HTTP request/response logs
- **debug**: Detailed debugging information, database operations

## Configuration

### Environment Variables

```bash
# Set log level (default: debug in dev, info in production)
LOG_LEVEL=debug

# Environment affects console logging
NODE_ENV=development  # Shows console logs
NODE_ENV=production   # No console logs
NODE_ENV=test        # Only error logs to console
```

### File Retention

- **Error logs**: 30 days
- **Combined logs**: 14 days  
- **HTTP logs**: 7 days
- **Max file size**: 20MB before rotation
- **Compression**: Enabled for old files

## Usage Examples

### Basic Logging

```javascript
const logger = require('./config/logger');

// Basic levels
logger.error('Database connection failed', { error: err.message });
logger.warn('Invalid user input', { userId, input });
logger.info('User created successfully', { userId, userName });
logger.debug('Cache hit', { key, dataSize });
```

### Specialized Logging Methods

```javascript
// Database operations
logger.database('insert', 'users', { userId: 'user123' });

// HTTP requests (handled by middleware)
logger.request(req, res, duration);

// Authentication events
logger.auth('login_success', userId, { userName });
logger.auth('login_failed', null, { userName, reason });

// Business events
logger.business('question_created', { questionId, userId });
logger.business('answer_accepted', { answerId, questionId });

// Security events
logger.security('unauthorized_access', { userId, resource, ip });
logger.security('admin_privilege_used', { userId, action });
```

### Error Logging with Context

```javascript
try {
    await someOperation();
} catch (error) {
    logger.error('Operation failed', {
        operation: 'someOperation',
        userId: req.user,
        error: error.message,
        stack: error.stack,
        requestId: req.id
    });
    throw error;
}
```

## Middleware Integration

### HTTP Request Logging

The `requestLogger` middleware automatically logs:
- Incoming requests with method, URL, IP, user agent
- Response times and status codes
- User context when available

### Error Logging

The `errorLogger` middleware captures:
- Unhandled errors with full request context
- Stack traces for debugging
- Request payload and parameters

## Production Considerations

### Log Analysis

Use tools like:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk**
- **Datadog**
- **CloudWatch** (for AWS)

### Log Shipping

For production, consider shipping logs to:
- Centralized logging service
- Log aggregation platforms
- Monitoring systems

### Performance

- Logs are asynchronous and don't block operations
- File rotation prevents disk space issues
- Debug logs are automatically disabled in production

## Best Practices

### What to Log

**Always Log:**
- Authentication events (login, logout, failures)
- Authorization failures
- Business-critical operations
- Errors and exceptions
- Performance metrics

**Consider Logging:**
- User actions (create, update, delete)
- External API calls
- Database operations
- Cache operations

**Don't Log:**
- Passwords or sensitive data
- Credit card numbers
- Personal identification information

### Log Message Format

```javascript
// Good: Structured with context
logger.info('User password updated', { 
    userId: user._id, 
    userName: user.userName,
    timestamp: new Date().toISOString()
});

// Bad: Unstructured string
logger.info(`User ${user.userName} updated password at ${new Date()}`);
```

### Error Context

Always include relevant context:

```javascript
logger.error('Database query failed', {
    query: 'getUserById',
    userId: targetUserId,
    error: error.message,
    stack: error.stack,
    requestId: req.id,
    duration: Date.now() - startTime
});
```

## Monitoring and Alerts

### Set up alerts for:
- High error rates
- Authentication failures
- Performance degradation
- Security events

### Metrics to track:
- Response times
- Error rates by endpoint
- User activity patterns
- System resource usage

## Testing

Logs are disabled during testing to avoid noise. Only error-level logs appear in test console output.

## Security Considerations

- Log files may contain sensitive information
- Implement proper file permissions
- Consider log file encryption for highly sensitive environments
- Regularly purge old logs based on compliance requirements

## Troubleshooting

### Common Issues

1. **Logs not appearing**: Check LOG_LEVEL environment variable
2. **Permission errors**: Ensure write permissions to logs directory
3. **Disk space**: Monitor log file sizes and retention policies
4. **Performance**: Reduce log level in production if needed

### Debug Mode

Set `LOG_LEVEL=debug` to see detailed information about:
- Database operations
- Cache hits/misses
- Detailed request processing
- WebSocket connections
