import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './Component.module.css';

// React-компонент на JSX
export function TodoList({ title, items = [], onToggle }) {
    const [filter, setFilter] = useState('all');
    const visible = useMemo(
        () => items.filter((item) => (filter === 'done' ? item.done : true)),
        [items, filter],
    );

    useEffect(() => {
        document.title = `${title} (${visible.length})`;
    }, [title, visible.length]);

    if (!items.length) {
        return <p className={styles.empty}>Список пуст</p>;
    }

    return (
        <section className={styles.list} data-count={visible.length}>
            {/* Комментарий внутри JSX */}
            <h2 style={{ color: '#ff7010', marginBottom: 8 }}>{title}</h2>

            <ul>
                {visible.map((item) => (
                    <li key={item.id} onClick={() => onToggle(item.id)}>
                        <input type="checkbox" checked={item.done} readOnly />
                        {item.done ? <s>{item.text}</s> : item.text}
                    </li>
                ))}
            </ul>

            <button type="button" disabled={filter === 'done'} onClick={() => setFilter('done')}>
                Только выполненные
            </button>
            <Footer total={items.length} />
        </section>
    );
}

const Footer = ({ total }) => <footer>Всего: {total}</footer>;

TodoList.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
};
