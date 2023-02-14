import { expect, test } from 'vitest';

/**
 *  @describe 描述, decribe会形成一个作用域
 *  @it 定义了一组关于测试期望的方法,它接收测试名称和一个含有测试期望的函数
 *  @expect 用来创建断言
 *  @toBe 可用于断言基础对象是否相等
 */
test('add', () => {
  expect(1 + 1).toBe(2);
  // expect('map'.slice(1)).toMatchSnapshot();
  // expect('map'.slice(1)).toMatchInlineSnapshot('"ap"');
});
