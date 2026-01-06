// 三關任務解鎖系統
// 任務必須依照順序完成才能進入下一關

const TASK_ORDER = ['wave', 'rain', 'dawn'];
const TASK_NAMES = {
    wave: '第一關：海風中的呢喃',
    rain: '第二關：蘭陽細雨陪伴',
    dawn: '第三關：情人灣日出勇氣'
};

// 從 localStorage 獲取任務進度
function getTaskProgress() {
    const progress = localStorage.getItem('taskProgress');
    if (!progress) {
        return {
            completed: [],
            currentTask: 'wave', // 第一關預設可進入
            lastCompletedAt: null
        };
    }
    try {
        return JSON.parse(progress);
    } catch {
        return {
            completed: [],
            currentTask: 'wave',
            lastCompletedAt: null
        };
    }
}

// 保存任務進度
function saveTaskProgress(progress) {
    localStorage.setItem('taskProgress', JSON.stringify(progress));
}

// 檢查任務是否已解鎖
function isTaskUnlocked(taskKey) {
    const progress = getTaskProgress();
    
    // 第一關永遠解鎖
    if (taskKey === 'wave') {
        return true;
    }
    
    // 檢查前置任務是否完成
    const taskIndex = TASK_ORDER.indexOf(taskKey);
    if (taskIndex === -1) return false;
    
    // 檢查前一關是否完成
    if (taskIndex > 0) {
        const previousTask = TASK_ORDER[taskIndex - 1];
        return progress.completed.includes(previousTask);
    }
    
    return false;
}

// 標記任務為已完成
function completeTask(taskKey) {
    const progress = getTaskProgress();
    
    // 檢查是否已解鎖
    if (!isTaskUnlocked(taskKey)) {
        console.warn(`任務 ${taskKey} 尚未解鎖，無法完成`);
        return false;
    }
    
    // 如果尚未完成，則標記為完成
    if (!progress.completed.includes(taskKey)) {
        progress.completed.push(taskKey);
        progress.lastCompletedAt = Date.now();
        
        // 更新當前可進行的任務
        const nextTaskIndex = TASK_ORDER.indexOf(taskKey) + 1;
        if (nextTaskIndex < TASK_ORDER.length) {
            progress.currentTask = TASK_ORDER[nextTaskIndex];
        } else {
            // 所有任務完成
            progress.currentTask = 'completed';
        }
        
        saveTaskProgress(progress);
        
        // 觸發完成事件
        window.dispatchEvent(new CustomEvent('taskCompleted', {
            detail: { taskKey, progress }
        }));
        
        return true;
    }
    
    return false;
}

// 檢查任務是否已完成
function isTaskCompleted(taskKey) {
    const progress = getTaskProgress();
    return progress.completed.includes(taskKey);
}

// 獲取下一個可進行的任務
function getNextTask() {
    const progress = getTaskProgress();
    return progress.currentTask;
}

// 獲取任務進度百分比
function getProgressPercentage() {
    const progress = getTaskProgress();
    const completedCount = progress.completed.length;
    return Math.round((completedCount / TASK_ORDER.length) * 100);
}

// 重置所有任務進度（用於測試或重新開始）
function resetTaskProgress() {
    localStorage.removeItem('taskProgress');
    window.dispatchEvent(new CustomEvent('taskProgressReset'));
}

// 顯示任務解鎖狀態 UI
function showTaskLockStatus(taskKey) {
    const isUnlocked = isTaskUnlocked(taskKey);
    const isCompleted = isTaskCompleted(taskKey);
    
    // 使用 i18n 翻譯狀態訊息
    const t = window.I18n ? window.I18n.getTranslation(window.I18n.getCurrentLanguage()) : {};
    
    if (isCompleted) {
        return {
            status: 'completed',
            message: t.statusCompleted || '✅ 已完成',
            canEnter: true
        };
    } else if (isUnlocked) {
        return {
            status: 'unlocked',
            message: t.statusUnlocked || '🔓 可進行',
            canEnter: true
        };
    } else {
        // 找出需要完成的前置任務
        const taskIndex = TASK_ORDER.indexOf(taskKey);
        const previousTask = taskIndex > 0 ? TASK_ORDER[taskIndex - 1] : null;
        
        return {
            status: 'locked',
            message: t.statusLocked || '🔒 尚未解鎖',
            canEnter: false,
            requiredTask: previousTask ? TASK_NAMES[previousTask] : null
        };
    }
}

// 阻止進入未解鎖的任務
function blockUnlockedTask(taskKey) {
    const status = showTaskLockStatus(taskKey);
    
    if (!status.canEnter) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;
        
        // 創建阻止遮罩
        const blockOverlay = document.createElement('div');
        blockOverlay.id = 'task-lock-overlay';
        blockOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        const taskName = TASK_NAMES[taskKey];
        const requiredTask = status.requiredTask || '前置任務';
        
        blockOverlay.innerHTML = `
            <div style="text-align: center; max-width: 400px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
                <h2 style="color: #0F172A; margin-bottom: 15px;">任務尚未解鎖</h2>
                <p style="color: #475569; margin-bottom: 10px; font-size: 1.1rem;">${taskName}</p>
                <p style="color: #64748B; margin-bottom: 20px;">需要先完成 ${requiredTask} 才能進入此任務</p>
                <div style="
                    background: #FEF3C7;
                    border-left: 4px solid #F59E0B;
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    text-align: left;
                ">
                    <p style="color: #92400E; margin: 0; font-size: 0.9rem;">
                        <strong>提示：</strong>請依照順序完成任務，每完成一關才能解鎖下一關。
                    </p>
                </div>
                <button id="task-lock-back" style="
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #3B82F6, #2563EB);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                ">返回首頁</button>
            </div>
        `;
        
        mainContent.style.position = 'relative';
        mainContent.appendChild(blockOverlay);
        
        document.getElementById('task-lock-back')?.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        return true; // 已阻止
    }
    
    return false; // 未阻止（可以進入）
}

// 顯示任務完成提示
function showTaskCompleteNotification(taskKey) {
    const taskName = TASK_NAMES[taskKey];
    const nextTask = getNextTask();
    const nextTaskName = nextTask !== 'completed' ? TASK_NAMES[nextTask] : null;
    
    // 創建完成通知
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        z-index: 10001;
        max-width: 350px;
        animation: slideInRight 0.3s ease;
    `;
    
    if (nextTaskName) {
        notification.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 10px;">🎉</div>
            <h3 style="margin: 0 0 10px 0; font-size: 1.2rem;">任務完成！</h3>
            <p style="margin: 0 0 10px 0; opacity: 0.95;">${taskName} 已完成</p>
            <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">下一關：${nextTaskName} 已解鎖</p>
        `;
    } else {
        notification.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 10px;">🏅</div>
            <h3 style="margin: 0 0 10px 0; font-size: 1.2rem;">恭喜完成所有任務！</h3>
            <p style="margin: 0; opacity: 0.95;">你已經完成了全部三關英雄旅程</p>
        `;
    }
    
    document.body.appendChild(notification);
    
    // 5 秒後自動消失
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// 導出函數供其他腳本使用
if (typeof window !== 'undefined') {
    window.TaskProgress = {
        getTaskProgress,
        saveTaskProgress,
        isTaskUnlocked,
        completeTask,
        isTaskCompleted,
        getNextTask,
        getProgressPercentage,
        resetTaskProgress,
        showTaskLockStatus,
        blockUnlockedTask,
        showTaskCompleteNotification,
        TASK_ORDER,
        TASK_NAMES
    };
}

