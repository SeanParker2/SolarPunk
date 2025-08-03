#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据备份脚本
用于备份SQLite数据库和生成备份报告
"""

import os
import shutil
import sqlite3
import json
from datetime import datetime
from pathlib import Path
import zipfile
import argparse

def get_database_path():
    """获取数据库路径"""
    # 从环境变量或默认路径获取数据库位置
    db_url = os.getenv('DATABASE_URL', 'sqlite:///./solarpunk.db')
    if db_url.startswith('sqlite:///'):
        return db_url.replace('sqlite:///', '')
    else:
        print("⚠️  当前配置使用的不是SQLite数据库")
        print(f"   数据库URL: {db_url}")
        print("   此脚本仅支持SQLite数据库备份")
        return None

def create_backup_directory():
    """创建备份目录"""
    backup_dir = Path('backups')
    backup_dir.mkdir(exist_ok=True)
    return backup_dir

def backup_database(db_path, backup_dir):
    """备份数据库文件"""
    if not Path(db_path).exists():
        print(f"❌ 数据库文件不存在: {db_path}")
        return None
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = f"solarpunk_db_backup_{timestamp}.db"
    backup_path = backup_dir / backup_filename
    
    try:
        shutil.copy2(db_path, backup_path)
        print(f"✅ 数据库备份成功: {backup_path}")
        return backup_path
    except Exception as e:
        print(f"❌ 数据库备份失败: {e}")
        return None

def export_data_to_json(db_path, backup_dir):
    """导出数据为JSON格式"""
    if not Path(db_path).exists():
        return None
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    json_filename = f"solarpunk_data_export_{timestamp}.json"
    json_path = backup_dir / json_filename
    
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row  # 使结果可以按列名访问
        
        export_data = {
            'export_time': datetime.now().isoformat(),
            'tables': {}
        }
        
        # 获取所有表名
        cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'alembic_%'")
        tables = [row[0] for row in cursor.fetchall()]
        
        for table in tables:
            cursor = conn.execute(f"SELECT * FROM {table}")
            rows = cursor.fetchall()
            export_data['tables'][table] = [dict(row) for row in rows]
            print(f"   导出表 {table}: {len(rows)} 条记录")
        
        conn.close()
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, ensure_ascii=False, indent=2, default=str)
        
        print(f"✅ 数据导出成功: {json_path}")
        return json_path
        
    except Exception as e:
        print(f"❌ 数据导出失败: {e}")
        return None

def create_backup_archive(backup_files, backup_dir):
    """创建备份压缩包"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    archive_filename = f"solarpunk_backup_{timestamp}.zip"
    archive_path = backup_dir / archive_filename
    
    try:
        with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in backup_files:
                if file_path and Path(file_path).exists():
                    zipf.write(file_path, Path(file_path).name)
        
        print(f"✅ 备份压缩包创建成功: {archive_path}")
        return archive_path
        
    except Exception as e:
        print(f"❌ 创建备份压缩包失败: {e}")
        return None

def generate_backup_report(db_path, backup_files):
    """生成备份报告"""
    print("\n📊 备份报告")
    print("=" * 50)
    
    if not Path(db_path).exists():
        print("❌ 数据库文件不存在")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        
        # 统计各表记录数
        cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'alembic_%'")
        tables = [row[0] for row in cursor.fetchall()]
        
        print("📋 数据库统计:")
        total_records = 0
        for table in tables:
            cursor = conn.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            total_records += count
            print(f"   • {table}: {count} 条记录")
        
        print(f"   总计: {total_records} 条记录")
        
        # 数据库文件大小
        db_size = Path(db_path).stat().st_size
        print(f"   数据库大小: {db_size / 1024 / 1024:.2f} MB")
        
        conn.close()
        
        # 备份文件信息
        print("\n💾 备份文件:")
        for file_path in backup_files:
            if file_path and Path(file_path).exists():
                size = Path(file_path).stat().st_size
                print(f"   • {Path(file_path).name}: {size / 1024 / 1024:.2f} MB")
        
    except Exception as e:
        print(f"❌ 生成报告失败: {e}")

def cleanup_old_backups(backup_dir, keep_days=7):
    """清理旧备份文件"""
    print(f"\n🧹 清理{keep_days}天前的备份文件...")
    
    cutoff_time = datetime.now().timestamp() - (keep_days * 24 * 60 * 60)
    deleted_count = 0
    
    for file_path in backup_dir.glob('*'):
        if file_path.is_file() and file_path.stat().st_mtime < cutoff_time:
            try:
                file_path.unlink()
                print(f"   删除: {file_path.name}")
                deleted_count += 1
            except Exception as e:
                print(f"   删除失败 {file_path.name}: {e}")
    
    if deleted_count == 0:
        print("   没有需要清理的文件")
    else:
        print(f"   共删除 {deleted_count} 个文件")

def show_backup_recommendations():
    """显示备份建议"""
    print("\n💡 数据备份最佳实践")
    print("=" * 50)
    print("1. 🔄 自动备份设置:")
    print("   • 设置每日自动备份(推荐凌晨执行)")
    print("   • 使用cron job或部署平台的定时任务")
    print("   • 示例cron: 0 2 * * * /path/to/backup_script.py")
    
    print("\n2. 🌐 云端备份:")
    print("   • 将备份文件上传到云存储(AWS S3, Google Drive等)")
    print("   • 使用数据库托管服务的自动备份功能")
    print("   • 考虑跨地域备份以防灾难恢复")
    
    print("\n3. 🔐 备份安全:")
    print("   • 加密敏感备份文件")
    print("   • 限制备份文件访问权限")
    print("   • 定期测试备份恢复流程")
    
    print("\n4. 📅 备份策略:")
    print("   • 每日备份保留7天")
    print("   • 每周备份保留4周")
    print("   • 每月备份保留12个月")
    print("   • 重要节点手动备份")

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='Solarpunk Gallery 数据备份工具')
    parser.add_argument('--cleanup-days', type=int, default=7, help='清理多少天前的备份文件(默认7天)')
    parser.add_argument('--no-cleanup', action='store_true', help='跳过清理旧备份')
    parser.add_argument('--json-only', action='store_true', help='仅导出JSON格式')
    parser.add_argument('--db-only', action='store_true', help='仅备份数据库文件')
    
    args = parser.parse_args()
    
    print("💾 Solarpunk Gallery 数据备份工具")
    print("=" * 50)
    
    # 获取数据库路径
    db_path = get_database_path()
    if not db_path:
        return
    
    # 创建备份目录
    backup_dir = create_backup_directory()
    print(f"📁 备份目录: {backup_dir.absolute()}")
    
    backup_files = []
    
    # 执行备份
    if not args.json_only:
        print("\n🔄 备份数据库文件...")
        db_backup = backup_database(db_path, backup_dir)
        if db_backup:
            backup_files.append(db_backup)
    
    if not args.db_only:
        print("\n📤 导出数据为JSON...")
        json_backup = export_data_to_json(db_path, backup_dir)
        if json_backup:
            backup_files.append(json_backup)
    
    # 创建压缩包
    if backup_files:
        print("\n📦 创建备份压缩包...")
        archive = create_backup_archive(backup_files, backup_dir)
        if archive:
            backup_files.append(archive)
    
    # 生成报告
    generate_backup_report(db_path, backup_files)
    
    # 清理旧备份
    if not args.no_cleanup:
        cleanup_old_backups(backup_dir, args.cleanup_days)
    
    # 显示建议
    show_backup_recommendations()
    
    print("\n✨ 备份完成!")

if __name__ == "__main__":
    main()