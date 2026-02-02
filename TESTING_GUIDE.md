# Kanban Dashboard GitHub Backend - Testing Guide

## Quick Start for Testing

### 1. Local Testing (No GitHub Token Needed)
```bash
cd ~/projects/dashboard
python3 -m http.server 8000
# Open browser: http://localhost:8000
```

**Expected Behavior:**
- Dashboard loads with default tasks
- Sync status shows "Ready"
- All columns visible (Ideas, To Do, In Progress, Review, Done)
- Can create/edit/delete tasks
- Can drag tasks between columns
- Settings modal opens when clicking ⚙️

### 2. GitHub Integration Testing (With Token)

#### Prerequisites
1. Create GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Scopes: Select "repo" (full control)
   - Generate and copy token (ghp_xxxxx format)

2. Ensure you have write access to: `glennhaavar-prog/openclawdghb`

#### Test Steps

1. **Open Dashboard**
   ```
   http://localhost:8000
   ```
   - Should load default tasks from localStorage
   - Sync status shows "Ready"

2. **Configure GitHub Backend**
   - Click ⚙️ settings
   - Paste GitHub token in "GitHub Personal Access Token" field
   - Verify repository shows: `glennhaavar-prog/openclawdghb`
   - Verify file shows: `tasks.json`
   - Click "Save Settings"
   - Expected: Toast shows "✅ Settings saved!"
   - Expected: Sync status changes to "Syncing..." then "Synced" (green)

3. **Create a Test Task**
   - Click "+ New Task"
   - Title: "Test Task from Dashboard"
   - Priority: High
   - Assignee: Glenn
   - Click "Create Task"
   - Expected: Task appears in board
   - Expected: Sync status briefly shows "Synced"

4. **Verify GitHub Sync**
   - Open https://github.com/glennhaavar-prog/openclawdghb
   - Navigate to `tasks.json` file
   - Should see your new task in the JSON
   - Check "commits" - should see new commit with timestamp

5. **Test Manual Sync**
   - Click ⚙️ settings
   - Click "🔄 Sync Now"
   - Expected: Sync status shows "Syncing..."
   - Expected: After 1-2 seconds, changes to "Synced" (green)
   - Expected: No errors in browser console

6. **Test Error Handling**
   - Modify token in settings to invalid value
   - Try creating a new task
   - Expected: Task saves to localStorage
   - Expected: Toast shows error message
   - Expected: Sync status shows "error" (red)
   - Expected: App continues functioning

7. **Test Fallback Mode (No Token)**
   - Click ⚙️ settings
   - Clear GitHub token field
   - Click "Save Settings"
   - Create a new task
   - Expected: Task appears in board
   - Expected: Sync status stays "Ready"
   - Expected: No error messages
   - Expected: Task persists in localStorage

8. **Test All Existing Features**
   - ✓ Drag task between columns
   - ✓ Edit task (click ✎ icon)
   - ✓ Delete task (click × icon)
   - ✓ Change assignee
   - ✓ Change priority
   - ✓ Add description
   - ✓ Close modal with Escape key

## Automated Testing

### Run Validation Tests
```bash
cd ~/projects/dashboard
node final-check.js
```

**Expected Output:**
```
✅ ALL CHECKS PASSED - IMPLEMENTATION COMPLETE!
```

All 28 checks should pass, including:
- Settings modal elements
- Sync status display
- GitHub API integration
- localStorage fallback
- Error handling
- Existing features preserved

### Run Functional Test
```bash
cat functional-test.md
```

Reviews checklist of all implemented features.

## Browser Console Testing

1. Open DevTools (F12)
2. Go to Console tab
3. Try these commands:

```javascript
// Check if GitHub token is saved
getGithubToken()
// Should return your token or empty string

// Check localStorage
localStorage.getItem('kanban_tasks')
// Should return JSON array of tasks

// Manually trigger sync
syncTasks()
// Should load tasks and update board

// Check sync status
document.getElementById('syncStatus').className
// Should show "sync-status ready" or similar
```

## Expected Performance

- Initial load: < 1 second (localStorage)
- With GitHub sync: 1-3 seconds first load
- Task create/edit: < 500ms (localStorage immediately, GitHub async)
- Drag & drop: Instant (no network delay)
- Settings save: < 100ms

## File Structure

```
~/projects/dashboard/
├── index.html                  # Main dashboard (updated)
├── tasks.json                  # Local cache
├── IMPLEMENTATION_SUMMARY.md   # This implementation
├── TESTING_GUIDE.md           # Testing instructions
├── functional-test.md         # Feature checklist
├── test-validation.js         # Automated tests
├── final-check.js             # Final verification
└── .git/                       # Version control
```

## Troubleshooting

### Dashboard Won't Load
- Check browser console for errors
- Verify all scripts are properly closed
- Check that HTML file is syntactically valid

### Tasks Not Appearing
- Open DevTools Console
- Check `localStorage.getItem('kanban_tasks')`
- Verify tasks.json in repository has valid JSON

### GitHub Sync Not Working
- Verify token is valid and has "repo" scope
- Check GitHub API status: https://www.githubstatus.com
- Look for error messages in browser Console
- Verify network tab shows requests being made

### Sync Status Stuck on "Syncing..."
- Check browser console for errors
- Verify GitHub token has "repo" scope
- Check network connectivity
- Refresh page to reset

## Success Criteria ✅

All items below should be true:
- [x] Settings modal opens/closes properly
- [x] GitHub token saves to localStorage
- [x] Manual sync button works
- [x] Sync status shows correct states (Ready/Syncing/Synced/Error)
- [x] Tasks create, edit, delete successfully
- [x] Tasks persist in localStorage
- [x] Tasks sync to GitHub when token configured
- [x] Tasks load from GitHub on page reload with token
- [x] Drag and drop works
- [x] Assignee selection works
- [x] Priority badges display
- [x] Dark theme renders correctly
- [x] Error messages show as toast notifications
- [x] No JavaScript console errors
- [x] App functions without GitHub token (localStorage only)

## Next Steps

1. **Deployment**
   - Copy updated `index.html` to production
   - No code changes needed on server side
   - Works with any static hosting

2. **User Documentation**
   - Create token at https://github.com/settings/tokens
   - Paste in Settings modal
   - Enable automatic syncing

3. **Monitoring**
   - Check GitHub repository for successful commits
   - Monitor browser console for errors
   - Track sync status in production

4. **Future Enhancements**
   - Add OAuth instead of personal tokens
   - Implement real-time sync with webhooks
   - Add task history/version control
   - Support for multiple users/teams
