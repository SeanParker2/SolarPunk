#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生产环境安全检查脚本
用于检查关键环境变量和安全配置
"""

import os
import sys
from pathlib import Path

def check_environment_variables():
    """检查关键环境变量"""
    print("🔍 检查环境变量配置...")
    print("=" * 50)
    
    # 关键环境变量列表
    critical_vars = {
        'DATABASE_URL': '数据库连接URL',
        'ADMIN_PASSWORD': '管理员密码',
        'ADMIN_SECRET_KEY': '管理员会话密钥',
        'R2_ACCESS_KEY_ID': 'Cloudflare R2 访问密钥ID',
        'R2_SECRET_ACCESS_KEY': 'Cloudflare R2 秘密访问密钥',
        'R2_BUCKET_NAME': 'R2存储桶名称',
        'R2_ENDPOINT_URL': 'R2端点URL',
        'R2_PUBLIC_URL': 'R2公共访问URL'
    }
    
    missing_vars = []
    weak_vars = []
    
    for var_name, description in critical_vars.items():
        value = os.getenv(var_name)
        
        if not value:
            print(f"❌ {var_name}: 未设置 ({description})")
            missing_vars.append(var_name)
        elif len(value) < 8:
            print(f"⚠️  {var_name}: 已设置但可能过短 ({description})")
            weak_vars.append(var_name)
        else:
            # 隐藏敏感信息，只显示前几个字符
            masked_value = value[:4] + '*' * (len(value) - 4)
            print(f"✅ {var_name}: {masked_value} ({description})")
    
    return missing_vars, weak_vars

def check_env_file():
    """检查.env文件"""
    print("\n🔍 检查.env文件...")
    print("=" * 50)
    
    env_file = Path('.env')
    if env_file.exists():
        print("⚠️  发现.env文件 - 生产环境中应该删除此文件")
        print("   建议: 将所有环境变量设置在部署平台的环境变量配置中")
        return True
    else:
        print("✅ 未发现.env文件 - 符合生产环境最佳实践")
        return False

def check_password_security():
    """检查密码安全性"""
    print("\n🔍 检查密码安全性...")
    print("=" * 50)
    
    admin_password = os.getenv('ADMIN_PASSWORD', '')
    
    if not admin_password:
        print("❌ 管理员密码未设置")
        return False
    
    # 基本密码强度检查
    issues = []
    if len(admin_password) < 12:
        issues.append("密码长度少于12位")
    if not any(c.isupper() for c in admin_password):
        issues.append("缺少大写字母")
    if not any(c.islower() for c in admin_password):
        issues.append("缺少小写字母")
    if not any(c.isdigit() for c in admin_password):
        issues.append("缺少数字")
    if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in admin_password):
        issues.append("缺少特殊字符")
    
    if issues:
        print(f"⚠️  密码强度不足: {', '.join(issues)}")
        return False
    else:
        print("✅ 密码强度良好")
        return True

def check_https_readiness():
    """检查HTTPS准备情况"""
    print("\n🔍 检查HTTPS配置...")
    print("=" * 50)
    
    print("📋 HTTPS检查清单:")
    print("   □ 确认部署平台已启用SSL/TLS证书")
    print("   □ 确认所有API调用使用HTTPS")
    print("   □ 确认管理后台只能通过HTTPS访问")
    print("   □ 检查混合内容警告(HTTP资源在HTTPS页面中)")
    
    print("\n💡 常见部署平台SSL设置:")
    print("   • Vercel: 自动启用HTTPS")
    print("   • Netlify: 自动启用HTTPS")
    print("   • Render: 自动启用HTTPS")
    print("   • Heroku: 需要在设置中启用")

def generate_security_report(missing_vars, weak_vars, has_env_file, password_secure):
    """生成安全报告"""
    print("\n📊 安全检查报告")
    print("=" * 50)
    
    score = 100
    issues = []
    
    if missing_vars:
        score -= len(missing_vars) * 20
        issues.append(f"缺少{len(missing_vars)}个关键环境变量")
    
    if weak_vars:
        score -= len(weak_vars) * 10
        issues.append(f"{len(weak_vars)}个环境变量可能过短")
    
    if has_env_file:
        score -= 15
        issues.append("存在.env文件(生产环境风险)")
    
    if not password_secure:
        score -= 25
        issues.append("管理员密码强度不足")
    
    score = max(0, score)
    
    if score >= 90:
        status = "🟢 优秀"
    elif score >= 70:
        status = "🟡 良好"
    elif score >= 50:
        status = "🟠 需要改进"
    else:
        status = "🔴 存在风险"
    
    print(f"安全评分: {score}/100 {status}")
    
    if issues:
        print("\n⚠️  发现的问题:")
        for issue in issues:
            print(f"   • {issue}")
    
    if score < 100:
        print("\n🔧 建议的改进措施:")
        if missing_vars:
            print("   1. 在部署平台设置所有缺少的环境变量")
        if weak_vars:
            print("   2. 增强过短的环境变量值")
        if has_env_file:
            print("   3. 删除.env文件，使用平台环境变量")
        if not password_secure:
            print("   4. 设置更强的管理员密码(12+字符，包含大小写、数字、特殊字符)")
        print("   5. 确认部署平台已启用HTTPS")
        print("   6. 定期轮换密钥和密码")

def main():
    """主函数"""
    print("🛡️  Solarpunk Gallery 生产环境安全检查")
    print("=" * 60)
    
    # 执行各项检查
    missing_vars, weak_vars = check_environment_variables()
    has_env_file = check_env_file()
    password_secure = check_password_security()
    check_https_readiness()
    
    # 生成报告
    generate_security_report(missing_vars, weak_vars, has_env_file, password_secure)
    
    print("\n✨ 检查完成!")
    
    # 如果有严重问题，返回非零退出码
    if missing_vars or not password_secure:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()