import { useState, useEffect } from 'react'
import './App.css'

const TOPICS = [
  { id: 1, category: 'Microsoft Dataverse', title: 'テーブル・列・リレーションシップの構成' },
  { id: 2, category: 'Microsoft Dataverse', title: 'ロールとセキュリティの設定' },
  { id: 3, category: 'Microsoft Dataverse', title: 'ビジネスルールの作成' },
  { id: 4, category: 'Microsoft Dataverse', title: 'カスケードルールの設定' },
  { id: 5, category: 'Power Apps', title: 'モデル駆動型アプリの作成' },
  { id: 6, category: 'Power Apps', title: 'キャンバスアプリの基本' },
  { id: 7, category: 'Power Apps', title: 'フォームとビューのカスタマイズ' },
  { id: 8, category: 'Power Automate', title: '自動化フローの作成' },
  { id: 9, category: 'Power Automate', title: 'ビジネスプロセスフローの設定' },
  { id: 10, category: 'Power Pages', title: 'ポータルサイトの基本設定' },
  { id: 11, category: 'ソリューション管理', title: 'マネージド／アンマネージドソリューション' },
  { id: 12, category: 'ソリューション管理', title: '環境間のデプロイ' },
]

const STATUS = ['未着手', '学習中', '完了']

function App() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('certpath-progress')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem('certpath-progress', JSON.stringify(progress))
  }, [progress])

  const updateStatus = (id) => {
    setProgress(prev => {
      const current = prev[id] || 0
      return { ...prev, [id]: (current + 1) % 3 }
    })
  }

  const toggleReview = (id) => {
    setProgress(prev => ({
      ...prev,
      [`review_${id}`]: !prev[`review_${id}`]
    }))
  }

  const completedCount = TOPICS.filter(t => (progress[t.id] || 0) === 2).length
  const percentage = Math.round((completedCount / TOPICS.length) * 100)

  const categories = [...new Set(TOPICS.map(t => t.category))]

  return (
    <div className="app">
      <h1>📘 CertPath - PL-200 学習トラッカー</h1>

      <div className="progress-section">
        <p>{completedCount} / {TOPICS.length} 完了（{percentage}%）</p>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {categories.map(cat => (
        <div key={cat} className="category">
          <h2>{cat}</h2>
          {TOPICS.filter(t => t.category === cat).map(topic => {
            const statusIndex = progress[topic.id] || 0
            const isReview = progress[`review_${topic.id}`] || false
            return (
              <div key={topic.id} className={`topic-row status-${statusIndex}`}>
                <button className="status-btn" onClick={() => updateStatus(topic.id)}>
                  {STATUS[statusIndex]}
                </button>
                <span className="topic-title">{topic.title}</span>
                <button
                  className={`review-btn ${isReview ? 'active' : ''}`}
                  onClick={() => toggleReview(topic.id)}
                >
                  🔁 要復習
                </button>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default App